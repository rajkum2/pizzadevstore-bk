import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-toastify';
import api from '../../api';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  AppBar,
  Toolbar
} from '@mui/material';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      toast.error('No order found');
      navigate('/cart');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error('Fetch order error:', error);
        toast.error('Failed to load order');
        navigate('/cart');
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await api.post('/payments/create-checkout-session', {
        orderId
      });

      const { url } = response.data;

      clearCart();

      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Checkout</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Complete Your Order
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {order.pizzas.map((pizza, index) => (
              <Box key={index} display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>
                  {pizza.name} x {pizza.quantity}
                </Typography>
                <Typography>${(pizza.price * pizza.quantity).toFixed(2)}</Typography>
              </Box>
            ))}
            <Box display="flex" justifyContent="space-between" sx={{ mt: 2, pt: 2, borderTop: 1 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${order.totalAmount.toFixed(2)}</Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Pay with Stripe'}
          </Button>

          <Button
            fullWidth
            variant="text"
            sx={{ mt: 2 }}
            onClick={() => navigate('/cart')}
          >
            Back to Cart
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default Checkout;
