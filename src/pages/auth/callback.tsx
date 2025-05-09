
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the fragment or query parameters
        const fragment = window.location.hash;
        const query = window.location.search;
        
        // Process Supabase callback if needed
        if (query.includes('access_token') || fragment.includes('access_token')) {
          const { error } = await supabase.auth.getSession();
          if (error) {
            console.error("Error in auth callback:", error);
          }
        }
        
        // Process Google OAuth callback
        const params = new URLSearchParams(query || fragment.substring(1));
        const googleToken = params.get('id_token') || params.get('credential');
        
        if (googleToken) {
          console.log("Received Google token", googleToken);
          // Here you would send the token to your backend
          // or use it to authenticate with your system
          
          // For now just log it
          console.log("Successfully authenticated with Google");
        }
      } catch (error) {
        console.error("Error processing authentication callback:", error);
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
