const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

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
