import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  console.log('ProtectedRoute - Token:', token);

  if (!token) {
    console.log('ProtectedRoute: No token, redirecting to login');
    return <Navigate to="/users" replace />;
  }

  return children;
};

export default ProtectedRoute;