const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pizzas
 *               - totalAmount
 *             properties:
 *               pizzas:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Pizza'
 *                 example:
 *                   - name: Margherita
 *                     quantity: 2
 *                     price: 10
 *                   - name: Pepperoni
 *                     quantity: 1
 *                     price: 12
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 example: 32.00
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request - Invalid order data
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Server error
 */
router.post('/', protect, async (req, res) => {
  try {
    const { pizzas, totalAmount } = req.body;

    if (!pizzas || !Array.isArray(pizzas) || pizzas.length === 0) {
      return res.status(400).json({ message: 'Please provide pizzas array' });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    for (const pizza of pizzas) {
      if (!pizza.name || !pizza.quantity || !pizza.price || pizza.quantity < 1 || pizza.price < 0) {
        return res.status(400).json({ message: 'Invalid pizza data' });
      }
    }

    const order = await Order.create({
      userId: req.user._id,
      pizzas,
      totalAmount,
      paymentStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order', error: error.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Server error
 */
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders', error: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Not authorized to view this order
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error fetching order', error: error.message });
  }
});

module.exports = router;
