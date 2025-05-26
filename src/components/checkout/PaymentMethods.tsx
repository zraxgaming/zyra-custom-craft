
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, DollarSign } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentMethodsProps {
  total: number;
  onPaymentSuccess: (orderId: string) => void;
  orderData: any;
  appliedCoupon?: any;
  appliedGiftCard?: any;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  total, 
  onPaymentSuccess, 
  orderData,
  appliedCoupon,
  appliedGiftCard
}) => {
  const [selectedMethod, setSelectedMethod] = useState("ziina");
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  // Ensure total is never negative
  const finalTotal = Math.max(0, total || 0);

  const handleZiinaPayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number for Ziina payment",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ziina-payment', {
        body: {
          amount: finalTotal,
          phone: phoneNumber,
          order_data: orderData,
          applied_coupon: appliedCoupon,
          applied_gift_card: appliedGiftCard
        }
      });

      if (error) throw error;

      if (data?.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (error) {
      console.error('Ziina payment error:', error);
      toast({
        title: "Payment failed",
        description: "Unable to process Ziina payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get PayPal client ID from environment variables
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const createPayPalOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: finalTotal.toFixed(2),
          currency_code: 'USD'
        }
      }]
    });
  };

  const onPayPalApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          total_amount: finalTotal,
          status: 'processing',
          payment_status: 'paid',
          payment_method: 'paypal',
          shipping_address: orderData,
          billing_address: orderData
        })
        .select()
        .single();

      if (error) throw error;

      onPaymentSuccess(order.id);
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast({
        title: "Payment failed",
        description: "Unable to process PayPal payment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="ziina" id="ziina" />
            <Label htmlFor="ziina" className="flex items-center gap-2 cursor-pointer flex-1">
              <Smartphone className="h-4 w-4" />
              Ziina Payment
            </Label>
          </div>

          {paypalClientId && (
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                <DollarSign className="h-4 w-4" />
                PayPal
              </Label>
            </div>
          )}
        </RadioGroup>

        {selectedMethod === "ziina" && (
          <div className="space-y-4 animate-slide-in-up">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+971 50 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleZiinaPayment} 
              disabled={isProcessing || !phoneNumber}
              className="w-full"
            >
              {isProcessing ? "Processing..." : `Pay $${finalTotal.toFixed(2)} with Ziina`}
            </Button>
          </div>
        )}

        {selectedMethod === "paypal" && paypalClientId && (
          <div className="animate-slide-in-up">
            <PayPalScriptProvider
              options={{
                clientId: paypalClientId,
                currency: "USD"
              }}
            >
              <PayPalButtons
                createOrder={createPayPalOrder}
                onApprove={onPayPalApprove}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  toast({
                    title: "Payment failed",
                    description: "PayPal payment failed",
                    variant: "destructive",
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
