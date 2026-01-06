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
  IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';

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
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pizza Menu
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            My Orders
          </Button>
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={getTotalItems()} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Our Delicious Pizzas
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {pizzas.map((pizza) => (
            <Grid item xs={12} sm={6} md={4} key={pizza.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {pizza.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {pizza.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    ${pizza.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleAddToCart(pizza)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Menu;
