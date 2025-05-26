
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthPageProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ children, requireAuth = true }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default AuthPage;
