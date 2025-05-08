
import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

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
    // Fetch PayPal client ID from site_config table
    const fetchPayPalConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "paypal_client_id")
          .single();

        if (error) {
          console.error("Error fetching PayPal client ID:", error);
          // Fallback to environment variable
          const envClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
          setPaypalClientId(envClientId || "test");
        } else if (data && data.value) {
          setPaypalClientId(data.value);
        } else {
          // Fallback to environment variable
          const envClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
          setPaypalClientId(envClientId || "test");
        }
      } catch (error) {
        console.error("Error:", error);
        setPaypalClientId("test"); // Fallback client ID
      } finally {
        setLoading(false);
      }
    };

    fetchPayPalConfig();
  }, []);

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
        You will be redirected to PayPal to complete your purchase.
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
