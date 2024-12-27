import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'supplier';
  requiredPermissions?: string[];
}

export default function AuthGuard({ 
  children, 
  requiredRole,
  requiredPermissions = []
}: AuthGuardProps) {
  const auth = useAuth();

  // Check if user has required role
  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has all required permissions
  if (requiredPermissions.length > 0 && 
      !requiredPermissions.every(permission => auth.can(permission))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}