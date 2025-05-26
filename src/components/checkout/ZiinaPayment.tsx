
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Smartphone } from "lucide-react";

interface ZiinaPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({ amount, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleZiinaPayment = async () => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ziina-payment', {
        body: {
          amount: amount,
          currency: 'AED',
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/checkout`,
          test: true
        }
      });

      if (error) {
        throw error;
      }

      if (data?.payment_id) {
        console.log('Ziina payment initiated:', data);
        
        // Simulate payment processing completion
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: "Payment Successful",
          description: `Ziina payment of AED ${(amount * 3.67).toFixed(2)} processed successfully`,
        });
        
        onSuccess(data.payment_id);
      } else {
        throw new Error('No payment ID received from Ziina');
      }

    } catch (error: any) {
      console.error('Ziina payment error:', error);
      const errorMessage = error.message || "Ziina payment failed. Please try again.";
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center border rounded-md p-3 bg-background hover:bg-muted/50 transition-colors">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded mr-2 flex items-center justify-center text-white font-bold animate-pulse">
            <Smartphone className="h-4 w-4" />
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
            Processing Ziina Payment...
          </>
        ) : (
          `Pay AED ${(amount * 3.67).toFixed(2)} with Ziina`
        )}
      </Button>
      
      <div className="text-xs text-muted-foreground text-center bg-muted/30 p-2 rounded">
        🔒 Secure payment processing in UAE Dirhams via Ziina
      </div>
    </div>
  );
};

export default ZiinaPayment;
