import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import { formatCurrency } from '../../utils';
import { toast } from 'react-toastify';
import {
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Fetch stats error:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Box display="flex" justifyContent="center" mb={2}>
        {React.cloneElement(icon, { sx: { fontSize: 50, color } })}
      </Box>
      <Typography variant="h4" gutterBottom>
        {value}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <Button color="inherit" onClick={() => navigate('/admin/users')}>
            Users
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin/orders')}>
            Orders
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin/payments')}>
            Payments
          </Button>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Overview
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon={<PeopleIcon />}
                color="primary.main"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Orders"
                value={stats?.totalOrders || 0}
                icon={<ShoppingCartIcon />}
                color="info.main"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats?.totalRevenue || 0)}
                icon={<AttachMoneyIcon />}
                color="success.main"
              />
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => navigate('/admin/users')}
              >
                Manage Users
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="info"
                onClick={() => navigate('/admin/orders')}
              >
                View All Orders
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate('/admin/payments')}
              >
                View Payments
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default AdminDashboard;
