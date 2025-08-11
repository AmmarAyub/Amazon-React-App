import React from 'react';
import { Navigate,Outlet  } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
   return children ? children : <Outlet />;
};

export default ProtectedRoute;