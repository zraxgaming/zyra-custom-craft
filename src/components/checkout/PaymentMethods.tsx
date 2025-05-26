
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
          user_id: orderData.user_id || orderData.email,
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

      // Simulate payment processing
      setTimeout(async () => {
        try {
          // Update order status to completed
          await supabase
            .from('orders')
            .update({ 
              status: 'processing',
              payment_status: 'paid'
            })
            .eq('id', order.id);

          onPaymentSuccess(order.id);
        } catch (error) {
          console.error('Error updating order:', error);
        }
      }, 2000);

      toast({
        title: "Payment processing",
        description: "Your payment is being processed...",
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Unable to process payment",
        variant: "destructive",
      });
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
              Ziina Payment
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
              <DollarSign className="h-4 w-4" />
              PayPal
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
          </div>
        )}

        <Button 
          onClick={processPayment} 
          disabled={isProcessing || (selectedMethod === "ziina" && !phoneNumber)}
          className="w-full"
          size="lg"
        >
          {isProcessing ? "Processing..." : `Pay $${finalTotal.toFixed(2)} with ${selectedMethod === 'ziina' ? 'Ziina' : 'PayPal'}`}
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
