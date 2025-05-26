
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Smartphone } from "lucide-react";

interface PaymentProcessorProps {
  amount: number;
  currency: string;
  orderData: any;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  paymentMethod: 'ziina' | 'paypal';
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  amount,
  currency,
  orderData,
  onSuccess,
  onError,
  paymentMethod
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processZiinaPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ziina-payment', {
        body: {
          amount: amount,
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/checkout`,
          order_data: orderData
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.payment_url) {
        // Store payment data for verification
        localStorage.setItem('pending_payment', JSON.stringify({
          payment_id: data.payment_id,
          amount: amount,
          order_data: orderData,
          method: 'ziina'
        }));
        
        // Redirect to real Ziina payment
        window.location.href = data.payment_url;
      } else {
        throw new Error('No payment URL received from Ziina');
      }
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      onError(error.message || 'Ziina payment failed');
    }
  };

  const processPayPalPayment = async () => {
    try {
      // For now, simulate PayPal until real integration is added
      toast({
        title: "PayPal Integration",
        description: "PayPal integration coming soon. Please use Ziina for now.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error('PayPal payment error:', error);
      onError(error.message || 'PayPal payment failed');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'ziina') {
        await processZiinaPayment();
      } else if (paymentMethod === 'paypal') {
        await processPayPalPayment();
      }
    } catch (error: any) {
      onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {paymentMethod === 'ziina' ? (
            <Smartphone className="h-5 w-5" />
          ) : (
            <CreditCard className="h-5 w-5" />
          )}
          {paymentMethod === 'ziina' ? 'Ziina Payment' : 'PayPal Payment'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {paymentMethod === 'ziina' 
                ? 'You will be redirected to Ziina to complete your payment securely.'
                : 'PayPal integration coming soon. Please use Ziina for now.'
              }
            </p>
            <p className="font-medium mt-2">
              Amount: {paymentMethod === 'ziina' ? 'AED' : currency} {
                paymentMethod === 'ziina' 
                  ? (amount * 3.67).toFixed(2)
                  : amount.toFixed(2)
              }
            </p>
          </div>
          
          <Button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === 'paypal')}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay with ${paymentMethod === 'ziina' ? 'Ziina' : 'PayPal'}`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
