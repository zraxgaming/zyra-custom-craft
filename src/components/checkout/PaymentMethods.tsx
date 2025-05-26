
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, DollarSign } from "lucide-react";
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

  const processZiinaPayment = async (orderId: string) => {
    try {
      // Get Ziina configuration from site_config
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_api_key')
        .single();

      if (configError || !configData?.value) {
        throw new Error('Ziina API configuration not found');
      }

      // Simulate Ziina payment for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update order status
      await supabase
        .from('orders')
        .update({ 
          status: 'processing',
          payment_status: 'paid'
        })
        .eq('id', orderId);

      toast({
        title: "Payment Successful",
        description: "Your Ziina payment has been processed successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Ziina payment failed. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const processPayPalPayment = async (orderId: string) => {
    try {
      // Get PayPal client ID from environment
      const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      
      if (!paypalClientId) {
        throw new Error('PayPal configuration not found');
      }

      // Simulate PayPal payment for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update order status
      await supabase
        .from('orders')
        .update({ 
          status: 'processing',
          payment_status: 'paid'
        })
        .eq('id', orderId);

      toast({
        title: "Payment Successful",
        description: "Your PayPal payment has been processed successfully",
      });

      return true;
    } catch (error: any) {
      console.error('PayPal payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "PayPal payment failed. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const processPayment = async () => {
    if (selectedMethod === "ziina" && !phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number for Ziina payment",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create the order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          total_amount: finalTotal,
          status: 'pending',
          payment_status: 'pending',
          payment_method: selectedMethod,
          shipping_address: orderData,
          billing_address: orderData
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map((item: any) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization || null
        }));

        await supabase
          .from('order_items')
          .insert(orderItems);
      }

      // Update coupon usage if applied
      if (appliedCoupon) {
        await supabase
          .from('coupons')
          .update({ used_count: appliedCoupon.used_count + 1 })
          .eq('id', appliedCoupon.id);
      }

      // Update gift card balance if applied
      if (appliedGiftCard) {
        const usedAmount = Math.min(appliedGiftCard.amount, finalTotal);
        await supabase
          .from('gift_cards')
          .update({ amount: appliedGiftCard.amount - usedAmount })
          .eq('id', appliedGiftCard.id);
      }

      // Process payment based on selected method
      let paymentSuccess = false;
      if (selectedMethod === 'ziina') {
        paymentSuccess = await processZiinaPayment(order.id);
      } else if (selectedMethod === 'paypal') {
        paymentSuccess = await processPayPalPayment(order.id);
      }

      if (paymentSuccess) {
        onPaymentSuccess(order.id);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Unable to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
              Ziina Payment (AED)
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
              <DollarSign className="h-4 w-4" />
              PayPal (USD)
            </Label>
          </div>
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
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <p>💰 Amount in AED: {(finalTotal * 3.67).toFixed(2)} AED</p>
              <p>🔒 Secure payment via Ziina Payment Gateway</p>
            </div>
          </div>
        )}

        {selectedMethod === "paypal" && (
          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg animate-slide-in-up">
            <p>💰 Amount in USD: ${finalTotal.toFixed(2)}</p>
            <p>🔒 Secure payment via PayPal</p>
          </div>
        )}

        <Button 
          onClick={processPayment} 
          disabled={isProcessing || (selectedMethod === "ziina" && !phoneNumber)}
          className="w-full animate-pulse"
          size="lg"
        >
          {isProcessing ? "Processing Payment..." : 
            `Pay ${selectedMethod === 'ziina' 
              ? `${(finalTotal * 3.67).toFixed(2)} AED` 
              : `$${finalTotal.toFixed(2)}`} with ${selectedMethod === 'ziina' ? 'Ziina' : 'PayPal'}`
          }
        </Button>

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
