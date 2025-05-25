
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ZiinaPaymentProps {
  onZiinaApprove: (data: any) => Promise<void>;
  isProcessing: boolean;
  total: number;
  hasValidAddress: boolean;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({
  onZiinaApprove,
  isProcessing,
  total,
  hasValidAddress
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleZiinaPayment = async () => {
    if (!hasValidAddress) {
      toast({
        title: "Shipping address required",
        description: "Please provide a valid shipping address before proceeding to payment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert AED to fils (1 AED = 100 fils)
      const amountInFils = Math.round(total * 100);
      
      // Create payment intent with Ziina API
      const response = await fetch('/api/ziina/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInFils,
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/checkout`,
          test: true // Set to false for production
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { redirect_url, payment_intent_id } = await response.json();
      
      // Redirect to Ziina payment page
      window.location.href = redirect_url;
      
    } catch (error: any) {
      console.error("Ziina payment error:", error);
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing your Ziina payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center border rounded-md p-3 bg-background">
            <div className="flex items-center">
              <div className="h-8 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-xs font-bold mr-3">
                Ziina
              </div>
              <span className="text-foreground">Pay with Ziina</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Fast and secure payment with Ziina
          </div>

          <Button
            onClick={handleZiinaPayment}
            disabled={isProcessing || isLoading || !hasValidAddress}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? "Processing..." : `Pay ${total.toFixed(2)} AED with Ziina`}
          </Button>

          {!hasValidAddress && (
            <p className="text-sm text-destructive">
              Please complete your shipping address to enable payment options.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
