import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, adminOnly }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.user || decoded.user.role !== 'admin') {
        return <Navigate to="/" replace />;
      }
    } catch (error) {
      console.error('Error decoding token in ProtectedRoute:', error);
      localStorage.removeItem('token'); // Remove invalid token
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;