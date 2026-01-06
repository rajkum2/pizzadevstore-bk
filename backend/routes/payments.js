const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/payments/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session for an order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The ID of the order to create checkout session for
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 sessionId:
 *                   type: string
 *                   description: Stripe checkout session ID
 *                   example: cs_test_a1b2c3d4e5f6g7h8i9j0
 *                 url:
 *                   type: string
 *                   description: Stripe checkout URL to redirect user
 *                   example: https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0
 *       400:
 *         description: Bad request - Order ID required or order already paid
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Not authorized for this order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error creating checkout session
 */
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this order' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    const lineItems = order.pizzas.map(pizza => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: pizza.name,
          description: `Delicious ${pizza.name} pizza`
        },
        unit_amount: Math.round(pizza.price * 100)
      },
      quantity: pizza.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
});

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint for payment events
 *     tags: [Payments]
 *     description: This endpoint receives webhooks from Stripe when payment events occur. Used internally by Stripe - not for direct API calls.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Stripe webhook event payload
 *     responses:
 *       200:
 *         description: Webhook received and processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Webhook signature verification failed
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const orderId = session.metadata.orderId;

      const order = await Order.findById(orderId);

      if (order) {
        order.paymentStatus = 'paid';
        order.stripePaymentId = session.payment_intent;
        await order.save();

        console.log(`Order ${orderId} marked as paid`);
      }
    } catch (error) {
      console.error('Error updating order after payment:', error);
    }
  }

  res.json({ received: true });
});

module.exports = router;
