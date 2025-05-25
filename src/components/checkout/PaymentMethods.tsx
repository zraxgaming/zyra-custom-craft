
import React, { useState, useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ZiinaPayment from "./ZiinaPayment";

export interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const [paypalClientId, setPaypalClientId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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
      <Card>
        <CardContent className="pt-6">
          <div className="font-medium text-lg mb-4 text-foreground">Payment Method</div>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="font-medium text-lg mb-4 text-foreground">Payment Method</div>
        
        <Tabs value={selectedMethod} onValueChange={onMethodChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ziina">Ziina (AED)</TabsTrigger>
            <TabsTrigger value="paypal">PayPal (USD)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ziina" className="mt-4">
            <ZiinaPayment />
          </TabsContent>
          
          <TabsContent value="paypal" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center border rounded-md p-3 bg-background">
                <div className="flex items-center">
                  <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-8 mr-2" />
                  <span className="text-foreground">PayPal or Credit/Debit Card</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex gap-2">
                  <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
                  <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8" />
                  <img src="https://img.icons8.com/color/48/000000/amex.png" alt="American Express" className="h-8" />
                </div>
              </div>

              {paypalClientId && (
                <PayPalScriptProvider options={{ 
                  clientId: paypalClientId,
                  currency: "USD",
                  intent: "capture",
                  components: "buttons",
                  'enable-funding': "card",
                  'disable-funding': "paylater,venmo"
                }}>
                  <PayPalButtons
                    style={{ 
                      layout: "horizontal",
                      color: "blue",
                      shape: "rect",
                      label: "pay"
                    }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: "10.00",
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order!.capture().then((details) => {
                        toast({
                          title: "Payment successful!",
                          description: `Transaction completed by ${details.payer?.name?.given_name}`,
                        });
                      });
                    }}
                    onError={(err) => {
                      console.error("PayPal Checkout onError", err);
                      toast({
                        title: "Payment failed",
                        description: "There was an error processing your PayPal payment",
                        variant: "destructive",
                      });
                    }}
                  />
                </PayPalScriptProvider>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
