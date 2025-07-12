import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import { Button, Typography, Box, Container, CardMedia, Link as MuiLink } from '@mui/material'; // Import Material UI components

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
        toast.error(`Error fetching course: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(course);
    toast.success(`${course.title} added to cart!`);
  };

  if (loading) {
    return <Typography className="message">Loading course details...</Typography>;
  }

  if (error) {
    return <Typography className="message">Error: {error}</Typography>;
  }

  if (!course) {
    return <Typography className="message">Course not found.</Typography>;
  }

  return (
    <Box className="page-background course-detail-background">
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <Box className="glass-card" sx={{
          maxWidth: '800px',
          width: '100%',
          textAlign: 'center',
          p: 4,
        }}>
          <Typography variant="h3" component="h2" gutterBottom>{course.title}</Typography>
          <CardMedia
            component="img"
            image={course.image}
            alt={course.title}
            sx={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          />
          <Typography variant="body1" paragraph>{course.description}</Typography>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            Price: ${course.price}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: '25px' }}>
            Video: <MuiLink href={course.videoUrl} target="_blank" rel="noopener noreferrer">Watch Now</MuiLink>
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            <Button variant="contained" color="info" onClick={handleAddToCart}>Add to Cart</Button>
            <Button variant="contained" color="warning">Buy Now</Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CourseDetail;