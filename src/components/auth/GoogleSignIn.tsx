
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface GoogleSignInProps {
  isSignUp?: boolean;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ isSignUp = false }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string>("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get Google Client ID from environment variables
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (clientId) {
      setGoogleClientId(clientId);
    } else {
      console.warn("Google Client ID not found in environment variables");
    }
    
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up script only if it exists in the document
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handleGoogleSignIn = async () => {
    if (!googleClientId) {
      toast({
        title: "Configuration error",
        description: "Google authentication is not properly configured.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!window.google) {
        throw new Error("Google API not loaded");
      }
      
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Try rendering the button manually if auto prompt doesn't work
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button') as HTMLElement,
            { theme: 'outline', size: 'large', width: '100%', text: isSignUp ? 'signup_with' : 'signin_with' }
          );
        }
      });
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast({
        title: "Google sign in failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleCredentialResponse = async (response: any) => {
    try {
      const token = response.credential;
      
      // Send token to auth callback handler
      localStorage.setItem('google_token', token);
      
      // Redirect to the callback page
      navigate('/auth/callback?credential=' + token);
      
    } catch (error: any) {
      console.error("Error processing Google credential:", error);
      toast({
        title: "Authentication failed",
        description: error.message || "Could not process Google login.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading || !googleClientId}
      >
        {isLoading ? (
          <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-current rounded-full inline-block"></span>
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        {isSignUp ? "Sign up with Google" : "Sign in with Google"}
      </Button>
      <div id="google-signin-button" className="mt-2"></div>
    </>
  );
};

// Add this type definition to make TypeScript happy with the window.google object
declare global {
  interface Window {
    google: any;
  }
}

export default GoogleSignIn;
