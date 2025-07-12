import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Typography, Box, Container, CardMedia } from '@mui/material'; // Import Material UI components

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setPaymentError(null);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded. Make sure to disable form submission until Stripe.js has loaded.
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setPaymentError(error.message);
      toast.error(error.message);
      setLoading(false);
    } else {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({
            courseIds: cartItems.map(item => item._id),
            totalAmount: parseFloat(getTotalPrice()),
            paymentMethodId: paymentMethod.id,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setPaymentSuccess(true);
          clearCart();
          toast.success('Payment Successful! Your order has been placed.');
          // Optionally navigate to a success page or show a modal
          // navigate('/order-success');
        } else {
          setPaymentError(data.msg || 'Payment failed');
          toast.error(data.msg || 'Payment failed');
        }
      } catch (err) {
        console.error('Checkout error:', err);
        setPaymentError('An unexpected error occurred.');
        toast.error('An unexpected error occurred.');
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" component="h3" gutterBottom sx={{ marginBottom: '15px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '10px' }}>Order Summary</Typography>
      <Box sx={{ marginBottom: '20px' }}>
        {cartItems.map((item) => (
          <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <CardMedia
              component="img"
              sx={{ width: 60, height: 60, borderRadius: '4px', mr: 1, objectFit: 'cover' }}
              image={item.image}
              alt={item.title}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1">{item.title}</Typography>
              <Typography variant="body2" color="primary">${item.price.toFixed(2)}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#007bff', textAlign: 'right', marginBottom: '20px' }}>Total: ${getTotalPrice()}</Typography>

      <Typography variant="h5" component="h3" gutterBottom sx={{ marginBottom: '15px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '10px' }}>Payment Details</Typography>
      <Box sx={{ border: '1px solid rgba(255, 255, 255, 0.3)', padding: '10px', borderRadius: '4px', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.1)' }}>
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#333' } } }} />
      </Box>

      {paymentError && <Typography color="error" sx={{ marginBottom: '15px', textAlign: 'center' }}>{paymentError}</Typography>}
      {paymentSuccess && <Typography color="success" sx={{ marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>Payment Successful! Your order has been placed.</Typography>}

      <Button type="submit" variant="contained" color="success" fullWidth disabled={!stripe || loading || paymentSuccess}>
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please add courses before checking out.');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  if (cartItems.length === 0) {
    return null; // Or a loading spinner, or a message
  }

  return (
    <Box className="page-background checkout-background">
      <Container maxWidth="sm" sx={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', marginBottom: '30px' }}>Checkout</Typography>
        <Elements stripe={stripePromise}>
          <Box className="glass-card" sx={{ p: 4, width: '100%', maxWidth: '500px' }}>
            <CheckoutForm />
          </Box>
        </Elements>
      </Container>
    </Box>
  );
};

export default Checkout;