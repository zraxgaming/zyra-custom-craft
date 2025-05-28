
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import EnhancedAuthPage from "@/components/auth/EnhancedAuthPage";

const Auth = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <EnhancedAuthPage />;
};

export default Auth;
