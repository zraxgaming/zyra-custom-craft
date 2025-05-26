
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
    // Load PayPal SDK
    const loadPayPalSDK = () => {
      if (window.paypal) {
        setPaypalLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'demo'}&currency=USD&intent=capture`;
      script.onload = () => setPaypalLoaded(true);
      script.onerror = () => {
        console.error('Failed to load PayPal SDK');
        onError('Failed to load PayPal payment system');
      };
      document.head.appendChild(script);
    };

    loadPayPalSDK();
  }, [onError]);

  useEffect(() => {
    if (paypalLoaded && window.paypal) {
      // Render PayPal button
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
              email_address: orderData.email,
              address: {
                address_line_1: orderData.address,
                admin_area_2: orderData.city,
                admin_area_1: orderData.state,
                postal_code: orderData.zipCode,
                country_code: 'US'
              }
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
      <div className="flex items-center border rounded-md p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-md transition-all duration-300 hover-3d-lift">
        <div className="flex items-center flex-1">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl mr-4 flex items-center justify-center text-white font-bold animate-float-gentle">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-foreground font-semibold text-lg">Pay with PayPal</span>
            <p className="text-sm text-muted-foreground">Secure online payment</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            ${amount.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">USD</div>
        </div>
      </div>
      
      <div className="animate-scale-in">
        {!paypalLoaded ? (
          <Button disabled className="w-full" size="lg">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading PayPal...
          </Button>
        ) : (
          <div id="paypal-button-container" className="w-full"></div>
        )}
      </div>
      
      {isProcessing && (
        <div className="text-center animate-fade-in">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-2">Processing PayPal payment...</p>
        </div>
      )}
      
      <div className="text-xs text-center space-y-2 animate-fade-in">
        <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>🔒 Secure payment processing via PayPal</span>
        </div>
        <div className="text-muted-foreground">
          Powered by PayPal • 256-bit SSL encryption • Buyer protection
        </div>
      </div>
    </div>
  );
};

export default PayPalPayment;
