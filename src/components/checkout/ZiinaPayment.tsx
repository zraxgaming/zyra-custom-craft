
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import { Loader2 } from "lucide-react";

const ZiinaPayment: React.FC = () => {
  const { toast } = useToast();
  const { total } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleZiinaPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Call the Ziina payment edge function
      const { data, error } = await supabase.functions.invoke('ziina-payment', {
        body: {
          amount: total,
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/checkout`,
          test: true // Set to false for production
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redirect to Ziina checkout
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL received');
      }

    } catch (error: any) {
      console.error('Ziina payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize Ziina payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center border rounded-md p-3 bg-background hover:bg-muted/50 transition-colors">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded mr-2 flex items-center justify-center text-white font-bold animate-pulse">
            Z
          </div>
          <span className="text-foreground font-medium">Pay with Ziina (AED)</span>
        </div>
      </div>
      
      <Button
        onClick={handleZiinaPayment}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay AED ${total.toFixed(2)} with Ziina`
        )}
      </Button>
      
      <div className="text-xs text-muted-foreground text-center bg-muted/30 p-2 rounded">
        🔒 Secure payment processing in UAE Dirhams via Ziina
      </div>
    </div>
  );
};

export default ZiinaPayment;
