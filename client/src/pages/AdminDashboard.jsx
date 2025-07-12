import React, { useState, useEffect } from 'react';
import CourseForm from '../components/CourseForm';
import { toast } from 'react-toastify';
import { Button, Typography, Box, Container, Grid, Card, CardContent, CardMedia } from '@mui/material'; // Import Material UI components

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/courses`);
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

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/courses/${id}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token,
          },
        });

        if (res.ok) {
          fetchCourses(); // Refresh the list
          toast.success('Course deleted successfully!');
        } else {
          const errorData = await res.json();
          toast.error(errorData.msg || 'Failed to delete course');
        }
      } catch (err) {
        console.error('Error deleting course:', err);
        toast.error('Server error during deletion');
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingCourse(null);
    fetchCourses(); // Refresh courses after add/edit
  };

  if (loading) {
    return <Typography className="message">Loading admin dashboard...</Typography>;
  }

  if (error) {
    return <Typography className="message">Error: {error}</Typography>;
  }

  return (
    <Box className="page-background admin-dashboard-background">
      <Container sx={{ padding: '20px', minHeight: '100vh' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', marginBottom: '30px' }}>Admin Dashboard</Typography>
        <Button variant="contained" color="success" onClick={handleAddCourse} sx={{ display: 'block', margin: '0 auto 20px auto' }}>Add New Course</Button>

        {showForm && (
          <CourseForm
            course={editingCourse}
            onClose={() => setShowForm(false)}
            onSubmitSuccess={handleFormSubmit}
          />
        )}

        <Grid container spacing={4} justifyContent="center">
          {courses.length > 0 ? (
            courses.map((course) => (
              <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
                <Card className="glass-card" sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  textAlign: 'center',
                  p: 2,
                }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={course.image}
                    alt={course.title}
                    sx={{ objectFit: 'cover', marginBottom: '15px' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', marginBottom: '10px' }}>{course.description}</Typography>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                      Price: ${course.price}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '14px', marginBottom: '15px' }}>
                      Video: <MuiLink href={course.videoUrl} target="_blank" rel="noopener noreferrer">Link</MuiLink>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                      <Button variant="contained" color="primary" onClick={() => handleEditCourse(course)}>Edit</Button>
                      <Button variant="contained" color="error" onClick={() => handleDeleteCourse(course._id)}>Delete</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography className="message">No courses available. Add one!</Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;