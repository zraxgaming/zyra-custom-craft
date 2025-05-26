
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard } from "lucide-react";

interface PayPalPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  orderData: any;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ amount, onSuccess, onError, orderData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPayPalSDK = () => {
      if (window.paypal) {
        setPaypalLoaded(true);
        return;
      }

      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (!clientId) {
        onError('PayPal Client ID not configured');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
      script.onload = () => setPaypalLoaded(true);
      script.onerror = () => onError('Failed to load PayPal SDK');
      document.head.appendChild(script);
    };

    loadPayPalSDK();
  }, [onError]);

  useEffect(() => {
    if (paypalLoaded && window.paypal) {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toFixed(2),
                currency_code: 'USD'
              },
              description: `Order payment for ${orderData.email}`,
              custom_id: `order_${Date.now()}`,
              invoice_id: `inv_${Date.now()}`
            }],
            payer: {
              name: {
                given_name: orderData.firstName,
                surname: orderData.lastName
              },
              email_address: orderData.email
            }
          });
        },
        onApprove: async (data: any, actions: any) => {
          setIsProcessing(true);
          try {
            const details = await actions.order.capture();
            console.log('PayPal payment successful:', details);
            
            toast({
              title: "Payment Successful",
              description: `PayPal payment of $${amount.toFixed(2)} processed successfully`,
            });
            
            onSuccess(details.id);
          } catch (error: any) {
            console.error('PayPal capture error:', error);
            onError(error.message || 'PayPal payment capture failed');
          } finally {
            setIsProcessing(false);
          }
        },
        onError: (err: any) => {
          console.error('PayPal payment error:', err);
          onError('PayPal payment failed. Please try again.');
        },
        onCancel: (data: any) => {
          console.log('PayPal payment cancelled:', data);
          toast({
            title: "Payment Cancelled",
            description: "PayPal payment was cancelled by user",
            variant: "destructive",
          });
        },
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 55
        }
      }).render('#paypal-button-container');
    }
  }, [paypalLoaded, amount, orderData, onSuccess, onError, toast]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center border rounded-xl p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 hover:shadow-lg transition-all duration-500 hover-3d-lift border-blue-200">
        <div className="flex items-center flex-1">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl mr-4 flex items-center justify-center text-white font-bold animate-float-gentle shadow-lg">
            <CreditCard className="h-7 w-7" />
          </div>
          <div>
            <span className="text-foreground font-bold text-xl">Pay with PayPal</span>
            <p className="text-sm text-muted-foreground mt-1">Secure online payment • Buyer protection included</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            ${amount.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">USD</div>
        </div>
      </div>
      
      <div className="animate-scale-in">
        {!paypalLoaded ? (
          <Button disabled className="w-full h-16 text-lg" size="lg">
            <Loader2 className="h-6 w-6 mr-3 animate-spin" />
            Loading PayPal...
          </Button>
        ) : (
          <div id="paypal-button-container" className="w-full [&>div]:!rounded-xl [&>div]:!overflow-hidden [&>div]:!shadow-lg"></div>
        )}
      </div>
      
      {isProcessing && (
        <div className="text-center animate-fade-in bg-blue-50 p-6 rounded-xl border border-blue-200">
          <Loader2 className="h-10 w-10 mx-auto animate-spin text-blue-600 mb-3" />
          <p className="text-lg font-medium text-blue-900">Processing PayPal payment...</p>
          <p className="text-sm text-blue-600 mt-1">Please wait while we confirm your transaction</p>
        </div>
      )}
      
      <div className="text-xs text-center space-y-3 animate-fade-in">
        <div className="flex items-center justify-center gap-3 text-muted-foreground bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
          <span className="font-medium">🔒 Secure payment processing via PayPal</span>
        </div>
        <div className="text-muted-foreground font-medium">
          Powered by PayPal • 256-bit SSL encryption • Instant processing • Buyer protection
        </div>
      </div>
    </div>
  );
};

export default PayPalPayment;
