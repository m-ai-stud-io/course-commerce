import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { TextField, Button, Typography, Box, Container } from '@mui/material'; // Import Material UI components

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);
        window.dispatchEvent(new Event('authChange'));
        toast.success('Logged in successfully!');
        if (decoded.user && decoded.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.error(data.msg || 'Login failed');
      }
    } catch (err) {
      console.error(err.message);
      toast.error('Server error');
    }
  };

  return (
    <Box className="page-background login-background">
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Box className="glass-card" sx={{ width: '100%', textAlign: 'center', p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>Login</Typography>
          <form onSubmit={onSubmit}>
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
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>Login</Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;