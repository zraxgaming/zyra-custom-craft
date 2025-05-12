
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const GoogleSignIn: React.FC = () => {
  const { toast } = useToast();
  
  const handleGoogleSignIn = () => {
    toast({
      title: "Feature disabled",
      description: "Google Sign-In has been temporarily disabled.",
      variant: "destructive",
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignIn}
      disabled={true}
    >
      <span className="mr-2">Google Sign-In Disabled</span>
    </Button>
  );
};

export default GoogleSignIn;
