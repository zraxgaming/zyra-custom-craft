
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ZiinaPaymentProps {
  amount: number;
  orderData: any;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({
  amount,
  orderData,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const initiateZiinaPayment = async () => {
    setLoading(true);
    try {
      // Convert USD to AED (approximate rate)
      const aedAmount = amount * 3.67;
      
      // Create payment URL (simulated for demo)
      const redirectUrl = `https://pay.ziina.com/checkout?amount=${aedAmount}&currency=AED&merchant=demo&callback=${encodeURIComponent(window.location.origin + '/order-success')}`;
      
      setPaymentUrl(redirectUrl);
      
      toast({
        title: "Redirecting to Ziina",
        description: "You will be redirected to complete your payment",
      });

      // Simulate redirect
      setTimeout(() => {
        window.open(redirectUrl, '_blank');
        // Simulate successful payment after redirect
        setTimeout(() => {
          onSuccess(`ZIINA_${Date.now()}`);
        }, 3000);
      }, 1000);

    } catch (error: any) {
      console.error('Ziina payment error:', error);
      onError('Failed to initiate Ziina payment. Please try again.');
      toast({
        title: "Payment Error",
        description: "Failed to initiate Ziina payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Pay with Ziina
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-lg border">
          <div className="text-3xl font-bold text-primary mb-2">
            ${amount.toFixed(2)} USD
          </div>
          <div className="text-lg text-muted-foreground">
            ≈ {(amount * 3.67).toFixed(2)} AED
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Secure payment processing
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Multiple payment methods supported
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Instant payment confirmation
          </div>
        </div>

        {paymentUrl && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Payment window opened</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Complete your payment in the new window, then return here.
            </p>
          </div>
        )}

        <Button 
          onClick={initiateZiinaPayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay with Ziina
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By clicking "Pay with Ziina", you agree to Ziina's terms of service and will be redirected to their secure payment platform.
        </p>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
