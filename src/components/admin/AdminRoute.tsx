
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();

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
        description: `You don't have permission to access the admin panel. Admin email is set to: ${import.meta.env.VITE_ADMIN_EMAIL}`,
        variant: "destructive",
      });
      console.log("Admin access check:", {
        currentUserEmail: user.email,
        adminEmail: import.meta.env.VITE_ADMIN_EMAIL,
        isAdmin: isAdmin
      });
    }
  }, [isLoading, user, isAdmin, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
