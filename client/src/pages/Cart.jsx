import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Typography, Box, Container, Card, CardContent, CardMedia } from '@mui/material'; // Import Material UI components

const Cart = () => {
  const { cartItems, removeFromCart, getTotalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please add courses before checking out.');
      return;
    }
    navigate('/checkout');
  };

  const handleRemove = (id, title) => {
    removeFromCart(id);
    toast.info(`${title} removed from cart.`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.info('Cart cleared.');
  };

  return (
    <Box className="page-background cart-background">
      <Container sx={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', marginBottom: '30px' }}>Your Shopping Cart</Typography>
        {cartItems.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '1.2em', color: '#555' }}>Your cart is empty.</Typography>
        ) : (
          <Box className="glass-card" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '20px', maxWidth: '900px', width: '100%', p: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              {cartItems.map((item) => (
                <Card key={item._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', pb: '15px', '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 } }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 80, height: 80, borderRadius: '4px', mr: 2, objectFit: 'cover' }}
                    image={item.image}
                    alt={item.title}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}>
                    <Typography variant="h6" component="div">{item.title}</Typography>
                    <Typography variant="body1" color="primary">${item.price.toFixed(2)}</Typography>
                  </CardContent>
                  <Button variant="contained" color="error" onClick={() => handleRemove(item._id, item.title)}>Remove</Button>
                </Card>
              ))}
            </Box>
            <Box sx={{ width: { xs: '100%', md: '300px' }, textAlign: 'right', p: 3 }}>
              <Typography variant="h5" gutterBottom>Cart Summary</Typography>
              <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>Total: ${getTotalPrice()}</Typography>
              <Button variant="contained" color="secondary" onClick={handleClearCart} sx={{ mr: 1 }}>Clear Cart</Button>
              <Button variant="contained" color="success" onClick={handleCheckout}>Checkout</Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Cart;