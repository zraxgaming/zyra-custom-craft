
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ZiinaPayment: React.FC = () => {
  const { toast } = useToast();

  const handleZiinaPayment = () => {
    toast({
      title: "Ziina Integration",
      description: "Ziina payment integration is being set up. Please use PayPal for now.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center border rounded-md p-3 bg-background">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded mr-2 flex items-center justify-center text-white font-bold">
            Z
          </div>
          <span className="text-foreground">Pay with Ziina (AED)</span>
        </div>
      </div>
      
      <Button
        onClick={handleZiinaPayment}
        className="w-full"
        variant="outline"
      >
        Pay with Ziina
      </Button>
      
      <div className="text-xs text-muted-foreground text-center">
        Secure payment processing in UAE Dirhams
      </div>
    </div>
  );
};

export default ZiinaPayment;
