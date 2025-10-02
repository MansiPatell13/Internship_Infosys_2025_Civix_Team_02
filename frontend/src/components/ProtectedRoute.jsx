// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // No token, redirect to login
    return <Navigate to="/login" replace />;
  }

  const decoded = decodeToken(token);
  if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
    // Invalid or expired token - clear and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    return <Navigate to="/login" replace />;
  }

  // Token is valid, render the protected component
  return children;
}

export default ProtectedRoute;
