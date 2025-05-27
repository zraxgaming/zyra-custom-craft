
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard } from "lucide-react";

interface PayPalPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  orderData: any;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ 
  amount, 
  onSuccess, 
  onError, 
  orderData 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadPayPal = async () => {
      if (window.paypal) {
        initPayPal();
        return;
      }

      // Use client ID from .env.local
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (!clientId) {
        onError('PayPal client ID not configured');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
      script.onload = () => initPayPal();
      script.onerror = () => {
        setIsLoading(false);
        onError('Failed to load PayPal SDK');
      };
      document.head.appendChild(script);
    };

    const initPayPal = () => {
      if (!window.paypal || !paypalRef.current) {
        onError('PayPal SDK not loaded properly');
        return;
      }

      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toFixed(2),
                currency_code: 'USD'
              },
              description: `Order for ${orderData.email || 'Customer'}`
            }],
            intent: 'CAPTURE'
          });
        },
        onApprove: async (data: any, actions: any) => {
          setIsProcessing(true);
          try {
            const details = await actions.order.capture();
            console.log('PayPal payment captured:', details);
            
            toast({
              title: "Payment Successful",
              description: `PayPal payment of $${amount.toFixed(2)} completed`,
            });
            
            onSuccess(details.id);
          } catch (error: any) {
            console.error('PayPal capture error:', error);
            onError('Payment capture failed');
          } finally {
            setIsProcessing(false);
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          onError('PayPal payment failed');
        },
        onCancel: () => {
          toast({
            title: "Payment Cancelled",
            description: "PayPal payment was cancelled",
            variant: "destructive"
          });
        },
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 45
        }
      }).render(paypalRef.current);
      
      setIsLoading(false);
    };

    loadPayPal();
  }, [amount, orderData, onSuccess, onError, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-600" />
        <span className="text-blue-700 dark:text-blue-300">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
        <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-600" />
        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
          Secure Payment: ${amount.toFixed(2)} USD
        </p>
      </div>
      
      <div ref={paypalRef} className="min-h-[50px]"></div>
      
      {isProcessing && (
        <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-green-600" />
          <p className="text-sm text-green-700 dark:text-green-300">Processing your payment...</p>
        </div>
      )}
    </div>
  );
};

export default PayPalPayment;
