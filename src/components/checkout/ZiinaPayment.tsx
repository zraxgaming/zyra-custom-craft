import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Smartphone } from "lucide-react";

interface ZiinaPaymentProps {
  amount: number;
  orderData: any;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({ amount, orderData, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleZiinaPayment = async () => {
    setIsProcessing(true);
    try {
      // Always use AED for Ziina
      const paymentAmount = amount * 3.67;
      const { data, error } = await supabase.functions.invoke('ziina-payment', {
        body: {
          amount: paymentAmount,
          currency: 'AED',
          // Use consistent URLs for success and cancel/failure
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/order-failed`,
          order_data: orderData
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.payment_url) {
        // Store payment data for later verification
        localStorage.setItem('pending_payment', JSON.stringify({
          payment_id: data.payment_id,
          amount: paymentAmount,
          order_data: orderData,
          method: 'ziina'
        }));
        // Redirect to actual Ziina payment page
        window.location.href = data.payment_url;
      } else {
        throw new Error('No payment URL received from Ziina');
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
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded mr-2 flex items-center justify-center text-white font-bold">
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
            Redirecting to Ziina...
          </>
        ) : (
          `Pay AED ${(amount * 3.67).toFixed(2)} with Ziina`
        )}
      </Button>
      
      <div className="text-xs text-muted-foreground text-center bg-muted/30 p-2 rounded">
        🔒 Secure payment processing via Ziina Payment Gateway
      </div>
    </div>
  );
};

export default ZiinaPayment;
