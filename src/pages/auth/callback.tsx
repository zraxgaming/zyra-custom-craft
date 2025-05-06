
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error in auth callback:", error);
      }
      
      // Redirect to home page
      navigate("/");
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple mx-auto"></div>
        <p className="mt-4 text-lg">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
