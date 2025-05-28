
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import AdminAccess from "./AdminAccess";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setChecking(false);
    }
  }, [loading]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative p-6 bg-white dark:bg-gray-900 rounded-full shadow-xl">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Verifying Access...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we check your permissions.
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminAccess />;
  }

  return <>{children}</>;
};

export default AdminRoute;
