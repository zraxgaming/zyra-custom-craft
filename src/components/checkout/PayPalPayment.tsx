
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AeHaUBIcr2JHbGrEjhw8QNjQi7h7dJwGmLVL9NH-VcEWPJA1x9Zqzq1p8QmGqR3dJL2K0FiHnXz_lQaR&currency=USD';
      script.onload = () => initPayPal();
      script.onerror = () => {
        setIsLoading(false);
        onError('Failed to load PayPal SDK');
      };
      document.head.appendChild(script);
    };

    const initPayPal = () => {
      if (!window.paypal) {
        onError('PayPal SDK not loaded');
        return;
      }

      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toFixed(2)
              },
              description: `Order for ${orderData.email}`
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          setIsProcessing(true);
          try {
            const details = await actions.order.capture();
            toast({
              title: "Payment Successful",
              description: `PayPal payment of $${amount.toFixed(2)} completed`,
            });
            onSuccess(details.id);
          } catch (error: any) {
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
          label: 'paypal'
        }
      }).render(paypalRef.current);
      
      setIsLoading(false);
    };

    loadPayPal();
  }, [amount, orderData, onSuccess, onError, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Amount: ${amount.toFixed(2)} USD
        </p>
      </div>
      
      <div ref={paypalRef}></div>
      
      {isProcessing && (
        <div className="text-center p-4">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Processing payment...</p>
        </div>
      )}
    </div>
  );
};

export default PayPalPayment;
