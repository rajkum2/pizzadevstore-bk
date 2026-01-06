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
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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

  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}05 100%)`,
        border: `1px solid ${bgColor}30`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box
            sx={{
              bgcolor: `${bgColor}20`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
          </Box>
          <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
        </Box>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color }}>
          {value}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <LocalPizzaIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            New York Pizza - Admin
          </Typography>
          <Chip
            label={user?.email}
            color="secondary"
            sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
          />
          <Button
            color="inherit"
            onClick={() => navigate('/admin/users')}
            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
          >
            Users
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/admin/orders')}
            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
          >
            Orders
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/admin/payments')}
            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
          >
            Payments
          </Button>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #f57c00 100%)',
          color: 'white',
          py: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Container>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            Monitor your business performance and manage operations
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: 5 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Grid container spacing={4} sx={{ mb: 5 }}>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Total Users"
                  value={stats?.totalUsers || 0}
                  icon={<PeopleIcon />}
                  color="#1976d2"
                  bgColor="#1976d2"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Total Orders"
                  value={stats?.totalOrders || 0}
                  icon={<ShoppingCartIcon />}
                  color="#0288d1"
                  bgColor="#0288d1"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Total Revenue"
                  value={formatCurrency(stats?.totalRevenue || 0)}
                  icon={<AttachMoneyIcon />}
                  color="#2e7d32"
                  bgColor="#2e7d32"
                />
              </Grid>
            </Grid>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/admin/users')}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    Manage Users
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="info"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => navigate('/admin/orders')}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    View Orders
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<AttachMoneyIcon />}
                    onClick={() => navigate('/admin/payments')}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    View Payments
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
