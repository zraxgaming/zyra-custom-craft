
import React, { useState, useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/components/cart/CartProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import ZiinaPayment from "./ZiinaPayment";

export interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  shippingInfo?: any;
  deliveryOption?: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodChange,
  shippingInfo,
  deliveryOption = "standard"
}) => {
  const [paypalClientId, setPaypalClientId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    
    if (clientId) {
      setPaypalClientId(clientId);
      setLoading(false);
    } else {
      console.error("PayPal client ID is not defined in environment variables");
      toast({
        title: "Payment configuration error",
        description: "PayPal client ID is missing. Please check environment configuration.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [toast]);

  const createOrder = async (paymentMethod: string, paymentId?: string) => {
    try {
      if (!user || !shippingInfo) {
        throw new Error("User or shipping information missing");
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          status: "pending",
          shipping_address: shippingInfo,
          payment_method: paymentMethod,
          delivery_type: deliveryOption,
          payment_status: paymentMethod === "paypal" ? "paid" : "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      return order.id;
    } catch (error: any) {
      console.error("Order creation error:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="font-medium text-lg mb-4 text-foreground">Payment Method</div>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50 animate-fade-in">
      <CardContent className="pt-6">
        <div className="font-medium text-lg mb-4 text-foreground flex items-center gap-2">
          💳 Payment Method
        </div>
        
        <Tabs value={selectedMethod} onValueChange={onMethodChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="ziina" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 transition-all duration-300">
              Ziina (AED)
            </TabsTrigger>
            <TabsTrigger value="paypal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 transition-all duration-300">
              PayPal (USD)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ziina" className="mt-4 space-y-4">
            <ZiinaPayment />
          </TabsContent>
          
          <TabsContent value="paypal" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center border rounded-md p-3 bg-background hover:bg-muted/50 transition-colors">
                <div className="flex items-center">
                  <img 
                    src="https://img.icons8.com/color/48/000000/paypal.png" 
                    alt="PayPal" 
                    className="h-8 mr-2 animate-bounce" 
                  />
                  <span className="text-foreground font-medium">PayPal or Credit/Debit Card</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 p-2 bg-muted/30 rounded">
                <img src="https://img.icons8.com/color/32/000000/visa.png" alt="Visa" className="h-6 hover:scale-110 transition-transform" />
                <img src="https://img.icons8.com/color/32/000000/mastercard.png" alt="Mastercard" className="h-6 hover:scale-110 transition-transform" />
                <img src="https://img.icons8.com/color/32/000000/amex.png" alt="American Express" className="h-6 hover:scale-110 transition-transform" />
              </div>

              {paypalClientId && (
                <div className="animate-slide-in-up">
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
                        label: "pay",
                        height: 50
                      }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "USD",
                                value: totalPrice.toFixed(2),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const details = await actions.order!.capture();
                          
                          const orderId = await createOrder("paypal", details.id);
                          
                          toast({
                            title: "Payment successful! 🎉",
                            description: `Transaction completed by ${details.payer?.name?.given_name}`,
                          });

                          navigate(`/order-success/${orderId}`);
                          
                        } catch (error: any) {
                          console.error("PayPal order creation error:", error);
                          toast({
                            title: "Order creation failed",
                            description: "Payment was successful but order creation failed. Please contact support.",
                            variant: "destructive",
                          });
                          navigate("/order-failed");
                        }
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
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
