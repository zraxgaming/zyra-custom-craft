
import React, { useState, useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  const [paymentMethod, setPaymentMethod] = useState<string>("paypal");
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
        <div className="font-medium text-lg mb-4">Select Payment Method</div>
        
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-4">
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center cursor-pointer">
              <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-8 mr-2" />
              <span>PayPal</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="credit_card" id="credit_card" />
            <Label htmlFor="credit_card" className="flex items-center cursor-pointer">
              <div className="flex">
                <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
                <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8 ml-1" />
              </div>
              <span className="ml-2">Credit Card</span>
            </Label>
          </div>
        </RadioGroup>

        <div className="mt-6">
          {paymentMethod === "paypal" ? (
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
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      const details = await actions.order.capture();
                      await onPayPalApprove(details);
                    }
                  }}
                />
              </PayPalScriptProvider>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <input 
                  id="cardName"
                  type="text" 
                  placeholder="John Smith" 
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <input 
                  id="cardNumber"
                  type="text" 
                  placeholder="1234 5678 9012 3456" 
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <input 
                    id="expiry"
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <input 
                    id="cvc"
                    type="text" 
                    placeholder="123" 
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <Button 
                className="w-full" 
                disabled={isProcessing}
                onClick={() => {
                  toast({
                    title: "Credit card payment",
                    description: "This is just a demonstration. Credit card processing is not implemented.",
                  });
                }}
              >
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
