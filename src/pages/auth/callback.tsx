
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsProcessing(true);
        
        // Get the hash or query parameters from the URL
        const hash = window.location.hash;
        const query = window.location.search;
        
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
        } else {
          // Try to process Google OAuth callback if no session found
          const params = new URLSearchParams(query || hash.substring(1));
          const googleToken = params.get('id_token') || params.get('credential') || localStorage.getItem('google_token');
          
          if (googleToken) {
            console.log("Processing Google token");
            
            try {
              // Get user information from the token
              const response = await fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + googleToken);
              const userData = await response.json();
              
              if (userData.email) {
                // Check if user exists in database
                const { data: existingUser, error: checkError } = await supabase
                  .from('profiles')
                  .select('id')
                  .eq('id', userData.sub)
                  .maybeSingle();
                
                if (checkError) {
                  console.error("Error checking user:", checkError);
                }
                
                if (!existingUser) {
                  // Create a new user profile if it doesn't exist
                  const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                      id: userData.sub,
                      display_name: userData.name || userData.email.split('@')[0],
                    });
                  
                  if (insertError) {
                    console.error("Error creating profile:", insertError);
                  }
                }
                
                // Show success message
                toast({
                  title: "Sign-in successful",
                  description: "You have successfully signed in with Google.",
                });
              } else {
                throw new Error("Could not retrieve user information from Google");
              }
            } catch (error) {
              console.error("Error processing Google token:", error);
              toast({
                title: "Authentication failed",
                description: "Could not validate Google authentication.",
                variant: "destructive",
              });
            }
          }
        }
        
        // Clean up
        localStorage.removeItem('google_token');
      } catch (error) {
        console.error("Error processing authentication callback:", error);
        toast({
          title: "Authentication error",
          description: "An error occurred during the authentication process.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        // Redirect to home page
        navigate("/");
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
