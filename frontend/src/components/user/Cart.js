import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../api';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Box,
  TextField,
  AppBar,
  Toolbar,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (pizzaId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      updateQuantity(pizzaId, quantity);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const pizzas = cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const orderResponse = await api.post('/orders', {
        pizzas,
        totalAmount: getTotalAmount()
      });

      const orderId = orderResponse.data.order._id;

      navigate('/checkout', { state: { orderId } });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/menu')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Shopping Cart
          </Typography>
          <Typography variant="body1">{user?.email}</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        {cartItems.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Button variant="contained" onClick={() => navigate('/menu')} sx={{ mt: 2 }}>
              Browse Menu
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pizza</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Subtotal</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="center">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          inputProps={{ min: 1, style: { textAlign: 'center' } }}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => {
                            removeFromCart(item.id);
                            toast.info(`${item.name} removed from cart`);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">
                Total: ${getTotalAmount().toFixed(2)}
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  onClick={() => {
                    clearCart();
                    toast.info('Cart cleared');
                  }}
                  sx={{ mr: 2 }}
                >
                  Clear Cart
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Proceed to Checkout'}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Cart;
