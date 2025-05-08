
import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

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
          clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
          currency: "USD",
          intent: "capture"
        }}>
          <PayPalButtons
            style={{ layout: "horizontal", tagline: false }}
            disabled={isProcessing}
            forceReRender={[total]}
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
