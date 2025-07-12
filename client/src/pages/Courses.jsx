import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, CardContent, CardMedia, Button, Typography, Grid, Box, Container } from '@mui/material'; // Import Material UI components

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message);
        toast.error(`Error fetching courses: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <Typography className="message">Loading courses...</Typography>;
  }

  if (error) {
    return <Typography className="message">Error: {error}</Typography>;
  }

  return (
    <Box className="page-background courses-background">
      <Container sx={{ padding: '20px' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', marginBottom: '30px' }}>Our Courses</Typography>
        <Grid container spacing={4} justifyContent="center">
          {courses.length > 0 ? (
            courses.map((course) => (
              <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
                <Card className="glass-card" sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={course.image}
                    alt={course.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {course.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      ${course.price}
                    </Typography>
                    <Button component={Link} to={`/courses/${course._id}`} variant="contained" color="primary" sx={{ mt: 2 }}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography className="message">No courses available yet. Please check back later!</Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Courses;