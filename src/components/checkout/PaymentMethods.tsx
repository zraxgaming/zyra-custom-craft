
import React, { useState, useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentMethodsProps {
  onPayPalApprove: (data: any) => Promise<void>;
  isProcessing: boolean;
  total: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  onPayPalApprove,
  isProcessing,
  total,
}) => {
  const [paypalClientId, setPaypalClientId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get the PayPal client ID from env variable
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    
    if (clientId) {
      setPaypalClientId(clientId);
      setLoading(false);
    } else {
      console.error("PayPal client ID is not defined in environment variables");
      toast({
        title: "Payment configuration error",
        description: "PayPal client ID is missing. Please check .env.local",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="bg-white rounded-md p-4">
        <div className="font-medium text-lg mb-4">Payment Method</div>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zyra-purple"></div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="font-medium text-lg mb-4">Payment Method</div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center border rounded-md p-3">
            <div className="flex items-center">
              <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-8 mr-2" />
              <span>PayPal or Credit Card</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex gap-2">
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8" />
              <img src="https://img.icons8.com/color/48/000000/amex.png" alt="American Express" className="h-8" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <PayPalScriptProvider options={{ 
            clientId: paypalClientId,
            currency: "USD",
            intent: "capture",
            components: "buttons",
            // Allow credit/debit card payments through PayPal
            'disable-funding': "paylater,venmo"
          }}>
            <PayPalButtons
              style={{ 
                layout: "horizontal",
                color: "blue",
                shape: "rect",
                label: "pay"
              }}
              disabled={isProcessing}
              forceReRender={[total, paypalClientId]}
              createOrder={(data, actions) => {
                console.log("Creating PayPal order with total:", total.toFixed(2));
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: total.toFixed(2),
                        currency_code: "USD"
                      },
                      description: `Order from Zyra Store`
                    }
                  ]
                });
              }}
              onApprove={async (data, actions) => {
                console.log("PayPal payment approved:", data);
                if (actions.order) {
                  try {
                    const details = await actions.order.capture();
                    console.log("PayPal capture details:", details);
                    await onPayPalApprove(details);
                  } catch (error) {
                    console.error("Error capturing PayPal payment:", error);
                    toast({
                      title: "Payment Failed",
                      description: "There was an error processing your payment. Please try again.",
                      variant: "destructive",
                    });
                  }
                }
              }}
              onError={(err) => {
                console.error("PayPal Error:", err);
                toast({
                  title: "Payment Error",
                  description: "There was an error processing your payment. Please try again.",
                  variant: "destructive",
                });
              }}
              onCancel={() => {
                toast({
                  title: "Payment Cancelled",
                  description: "You cancelled the payment process. Try again when you're ready.",
                  variant: "default",
                });
              }}
            />
          </PayPalScriptProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
