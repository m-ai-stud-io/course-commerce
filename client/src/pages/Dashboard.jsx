import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { Typography, Box, Container, Grid, Card, CardMedia, CardContent, Link as MuiLink } from '@mui/material'; // Import Material UI components

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found.');
          setLoading(false);
          toast.error('No token found. Please log in.');
          return;
        }

        // Decode token to get user info (name, email, role)
        const decoded = jwtDecode(token);
        setUser(decoded.user);

        // Fetch user orders
        const ordersRes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
          headers: {
            'x-auth-token': token,
          },
        });

        if (!ordersRes.ok) {
          throw new Error(`HTTP error! status: ${ordersRes.status}`);
        }
        const ordersData = await ordersRes.json();
        setOrders(ordersData);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        toast.error(`Error fetching dashboard data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Typography className="message">Loading dashboard...</Typography>;
  }

  if (error) {
    return <Typography className="message">Error: {error}</Typography>;
  }

  return (
    <Box className="page-background dashboard-background">
      <Container sx={{ padding: '20px', minHeight: '100vh' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', marginBottom: '30px' }}>User Dashboard</Typography>

        {user && (
          <Box className="glass-card" sx={{ maxWidth: '600px', margin: '0 auto 30px auto', p: 3 }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#007bff', marginBottom: '15px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '10px' }}>Profile Information</Typography>
            <Typography variant="body1"><strong>Name:</strong> {user.name}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
            <Typography variant="body1"><strong>Role:</strong> {user.role}</Typography>
          </Box>
        )}

        <Typography variant="h5" component="h3" gutterBottom sx={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>Purchased Courses</Typography>
        {orders.length === 0 ? (
          <Typography className="message">You have not purchased any courses yet.</Typography>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {orders.map((order) => (
              order.courses.map((item) => (
                <Grid item key={item.course._id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="glass-card" sx={{
                    overflow: 'hidden',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingBottom: '15px',
                    height: '100%',
                  }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={item.course.image}
                      alt={item.course.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {item.course.title}
                      </Typography>
                      <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                        <MuiLink href={item.course.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</MuiLink>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;