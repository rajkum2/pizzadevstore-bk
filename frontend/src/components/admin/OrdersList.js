import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { formatDate, formatCurrency } from '../../utils';
import { toast } from 'react-toastify';
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
  Select,
  MenuItem,
  IconButton,
  AppBar,
  Toolbar,
  Box,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(o =>
      o._id === orderId ? { ...o, paymentStatus: newStatus, modified: true } : o
    ));
  };

  const handleSaveStatus = async (orderId) => {
    try {
      const orderToUpdate = orders.find(o => o._id === orderId);
      await api.put(`/admin/orders/${orderId}`, { paymentStatus: orderToUpdate.paymentStatus });
      toast.success('Order status updated successfully');
      setOrders(orders.map(o => o._id === orderId ? { ...o, modified: false } : o));
    } catch (error) {
      console.error('Update order error:', error);
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/admin/dashboard')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Orders Management
          </Typography>
          <Typography variant="body1">{user?.email}</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          All Orders
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id.substring(0, 8)}...</TableCell>
                    <TableCell>{order.userId?.email || 'N/A'}</TableCell>
                    <TableCell>
                      {order.pizzas.map((pizza, idx) => (
                        <div key={idx}>
                          {pizza.name} x {pizza.quantity}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        value={order.paymentStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        size="small"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="canceled">Canceled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="center">{formatDate(order.createdAt)}</TableCell>
                    <TableCell align="center">
                      {order.modified && (
                        <IconButton
                          color="primary"
                          onClick={() => handleSaveStatus(order._id)}
                        >
                          <SaveIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default OrdersList;
