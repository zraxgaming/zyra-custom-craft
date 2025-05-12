
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Process the authentication callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          // Show success message
          toast({
            title: "Sign-in successful",
            description: "You have successfully signed in.",
          });
          
          // Redirect to home page
          navigate("/");
        } else {
          // Authentication failed
          toast({
            title: "Authentication failed",
            description: "Could not complete the authentication process.",
            variant: "destructive",
          });
          navigate("/auth");
        }
      } catch (error: any) {
        console.error("Error processing authentication callback:", error);
        toast({
          title: "Authentication error",
          description: error.message || "An error occurred during the authentication process.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleCallback();
  }, [navigate, toast]);

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
