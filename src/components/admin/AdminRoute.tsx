
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to access the admin panel.",
        variant: "destructive",
      });
    } else if (!isLoading && user && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
    }
  }, [isLoading, user, isAdmin, toast]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth page if not logged in
  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Redirect to home if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
