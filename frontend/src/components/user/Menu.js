import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const pizzas = [
  { id: 1, name: 'Margherita', price: 10, description: 'Classic tomato and mozzarella' },
  { id: 2, name: 'Pepperoni', price: 12, description: 'Spicy pepperoni with cheese' },
  { id: 3, name: 'Veggie', price: 11, description: 'Fresh vegetables and herbs' },
  { id: 4, name: 'Hawaiian', price: 13, description: 'Ham and pineapple' },
  { id: 5, name: 'Meat Lovers', price: 15, description: 'Loaded with assorted meats' },
  { id: 6, name: 'BBQ Chicken', price: 14, description: 'BBQ sauce with grilled chicken' }
];

const Menu = () => {
  const { addToCart, getTotalItems } = useCart();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (pizza) => {
    addToCart(pizza);
    toast.success(`${pizza.name} added to cart!`);
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <LocalPizzaIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            New York Pizza
          </Typography>
          <Chip
            label={user?.email}
            color="secondary"
            sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
          />
          <Button
            color="inherit"
            startIcon={<RestaurantMenuIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 1, display: { xs: 'none', md: 'flex' } }}
          >
            My Orders
          </Button>
          <IconButton color="inherit" onClick={() => navigate('/cart')} sx={{ mr: 1 }}>
            <Badge badgeContent={getTotalItems()} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #f57c00 100%)',
          color: 'white',
          py: 6,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Container>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
            Our Menu
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 600, mx: 'auto' }}>
            Authentic New York-style pizzas made with the finest ingredients
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {pizzas.map((pizza) => (
            <Grid item xs={12} sm={6} md={4} key={pizza.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #d32f2f20 0%, #f57c0020 100%)',
                    p: 3,
                    textAlign: 'center'
                  }}
                >
                  <LocalPizzaIcon sx={{ fontSize: 64, color: 'primary.main' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    {pizza.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {pizza.description}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                      ${pizza.price.toFixed(2)}
                    </Typography>
                    <Chip label="Fresh" color="success" size="small" />
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => handleAddToCart(pizza)}
                    sx={{
                      py: 1.2,
                      fontWeight: 600
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Menu;
