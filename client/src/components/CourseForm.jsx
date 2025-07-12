import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { TextField, Button, Typography, Box } from '@mui/material'; // Import Material UI components

const CourseForm = ({ course, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    videoUrl: '',
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        price: course.price || '',
        image: course.image || '',
        videoUrl: course.videoUrl || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        image: '',
        videoUrl: '',
      });
    }
  }, [course]);

  const { title, description, price, image, videoUrl } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = course ? 'PUT' : 'POST';
      const url = course ? `${process.env.REACT_APP_BACKEND_URL}/api/courses/${course._id}` : `${process.env.REACT_APP_BACKEND_URL}/api/courses`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSubmitSuccess();
        onClose();
        toast.success(`Course ${course ? 'updated' : 'added'} successfully!`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.msg || 'Operation failed');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error('Server error');
    }
  };

  return (
    <Box sx={styles.overlay}>
      <Box className="glass-card" sx={{
        padding: '30px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
      }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>{course ? 'Edit Course' : 'Add New Course'}</Typography>
        <form onSubmit={onSubmit}>
          <TextField
            label="Title"
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            required
            fullWidth
            margin="normal"
            className="form-input"
          />
          <TextField
            label="Description"
            name="description"
            value={description}
            onChange={onChange}
            required
            fullWidth
            margin="normal"
            multiline
            rows={3}
            className="form-input"
          />
          <TextField
            label="Price"
            type="number"
            name="price"
            value={price}
            onChange={onChange}
            required
            fullWidth
            margin="normal"
            className="form-input"
          />
          <TextField
            label="Image URL"
            type="text"
            name="image"
            value={image}
            onChange={onChange}
            required
            fullWidth
            margin="normal"
            className="form-input"
          />
          <TextField
            label="Video URL"
            type="text"
            name="videoUrl"
            value={videoUrl}
            onChange={onChange}
            required
            fullWidth
            margin="normal"
            className="form-input"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button type="submit" variant="contained" color="primary" sx={{ flex: 1, marginRight: '10px' }}>
              {course ? 'Update Course' : 'Add Course'}
            </Button>
            <Button type="button" variant="contained" color="secondary" onClick={onClose} sx={{ flex: 1 }}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    padding: '30px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    // Styles handled by form-input class
  },
  textarea: {
    // Styles handled by form-input class
    minHeight: '80px',
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  submitButton: {
    // Styles handled by btn-primary class
    flex: 1,
    marginRight: '10px',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    flex: 1,
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#5a6268',
    },
  },
};

export default CourseForm;