require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3008',
  credentials: true
}));

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Pizza Dashboard API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      orders: '/api/orders',
      payments: '/api/payments',
      admin: '/api/admin'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
