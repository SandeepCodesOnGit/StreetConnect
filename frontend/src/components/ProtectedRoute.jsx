import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your custom hook

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // 1. If there is no user logged in, kick them to the sign-in page
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // 2. If they are logged in, but don't have the right role, kick them to home
  // (Double check if your backend returns the role as user.role or user.user.role!)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. If they pass all checks, render the page!
  return children;
};

export default ProtectedRoute;