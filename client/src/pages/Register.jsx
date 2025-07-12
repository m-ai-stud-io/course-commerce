import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TextField, Button, Typography, Box, Container } from '@mui/material'; // Import Material UI components

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      try {
        const newUser = {
          name,
          email,
          password,
        };

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          toast.success('Registered successfully!');
          navigate('/');
        } else {
          toast.error(data.msg || 'Registration failed');
        }
      } catch (err) {
        console.error(err.message);
        toast.error('Server error');
      }
    }
  };

  return (
    <Box className="page-background register-background">
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Box className="glass-card" sx={{ width: '100%', textAlign: 'center', p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>Register</Typography>
          <form onSubmit={onSubmit}>
            <TextField
              label="Name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              fullWidth
              margin="normal"
              className="form-input"
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              fullWidth
              margin="normal"
              className="form-input"
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              fullWidth
              margin="normal"
              className="form-input"
            />
            <TextField
              label="Confirm Password"
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
              required
              fullWidth
              margin="normal"
              className="form-input"
            />
            <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 3 }}>Register</Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;