
import React, { useState, useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";

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
        description: "PayPal client ID is missing. Please contact support.",
        variant: "destructive",
      });
      // Use sandbox client ID as fallback for development
      setPaypalClientId("test");
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
    <div className="bg-white rounded-md p-4">
      <div className="font-medium text-lg mb-4">Payment Method</div>
      <div className="flex items-center mt-2">
        <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-8" />
        <span className="ml-2 font-medium">PayPal</span>
      </div>
      <div className="text-sm text-gray-500 mt-1 mb-4">
        Complete your purchase securely with PayPal.
      </div>
      
      <div className="mt-4">
        <PayPalScriptProvider options={{ 
          clientId: paypalClientId,
          currency: "USD",
          intent: "capture"
        }}>
          <PayPalButtons
            style={{ layout: "horizontal", tagline: false }}
            disabled={isProcessing}
            forceReRender={[total, paypalClientId]}
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
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
            onApprove={onPayPalApprove}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PaymentMethods;
