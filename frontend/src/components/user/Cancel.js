import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minHeight="100vh"
        py={4}
      >
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CancelIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Payment Canceled
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your payment was canceled. No charges were made.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Feel free to try again when you're ready.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/cart')}
              sx={{ mr: 2 }}
            >
              Back to Cart
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/menu')}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Cancel;
