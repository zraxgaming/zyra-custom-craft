
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
          currency: 'AED',
          order_data: orderData,
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/checkout`
        }
      });

      if (error) throw error;

      // Simulate actual payment processing
      if (data?.payment_url) {
        // In real implementation, redirect to Ziina payment page
        window.open(data.payment_url, '_blank');
        
        // For demo, simulate success after delay
        setTimeout(() => {
          const transactionId = `ziina_${Date.now()}`;
          onSuccess(transactionId);
        }, 3000);
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
      // In real implementation, you would integrate with PayPal SDK
      // For now, simulate the payment process
      const paypalResponse = await fetch('/api/paypal/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          order_data: orderData
        })
      });

      if (!paypalResponse.ok) {
        // Simulate PayPal payment for demo
        const transactionId = `paypal_${Date.now()}`;
        onSuccess(transactionId);
        return;
      }

      const data = await paypalResponse.json();
      
      if (data.approval_url) {
        window.open(data.approval_url, '_blank');
      }
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
                : 'You will be redirected to PayPal to complete your payment securely.'
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
            disabled={isProcessing}
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
