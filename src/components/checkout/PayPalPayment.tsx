
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard } from "lucide-react";

interface PayPalPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ amount, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    
    try {
      // For now, simulate PayPal payment processing
      // In production, you would integrate with actual PayPal SDK
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transactionId = `pp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('PayPal payment successful:', { transactionId, amount });
      
      toast({
        title: "Payment Successful",
        description: `PayPal payment of $${amount.toFixed(2)} processed successfully`,
      });
      
      onSuccess(transactionId);
    } catch (error: any) {
      console.error('PayPal payment error:', error);
      const errorMessage = error.message || "PayPal payment failed. Please try again.";
      
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
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded mr-2 flex items-center justify-center text-white font-bold">
            <CreditCard className="h-4 w-4" />
          </div>
          <span className="text-foreground font-medium">Pay with PayPal</span>
        </div>
      </div>
      
      <Button
        onClick={handlePayPalPayment}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing PayPal Payment...
          </>
        ) : (
          `Pay $${amount.toFixed(2)} with PayPal`
        )}
      </Button>
      
      <div className="text-xs text-muted-foreground text-center bg-muted/30 p-2 rounded">
        🔒 Secure payment processing via PayPal
      </div>
    </div>
  );
};

export default PayPalPayment;
