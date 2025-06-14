
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Smartphone, CreditCard } from "lucide-react";

interface PaymentProcessorProps {
  amount: number;
  orderData: any;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  appliedCoupon?: any;
  appliedGiftCard?: any;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  amount,
  orderData,
  onSuccess,
  onError,
  appliedCoupon,
  appliedGiftCard
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const finalAmount = Math.max(0, amount);

  const processZiinaPayment = async () => {
    setIsProcessing(true);
    try {
      // Get Ziina configuration
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['ziina_api_key', 'ziina_merchant_id'])

      if (configError) throw new Error('Failed to load payment configuration');

      const config = configData?.reduce((acc, item) => {
        acc[item.key] = typeof item.value === 'string' ? item.value : String(item.value);
        return acc;
      }, {} as Record<string, string>) || {};

      if (!config.ziina_api_key) {
        throw new Error('Payment system not configured');
      }

      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          total_amount: finalAmount,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'ziina',
          shipping_address: orderData,
          billing_address: orderData,
          delivery_type: orderData.delivery_type || 'standard'
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

        await supabase.from('order_items').insert(orderItems);
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
        const usedAmount = Math.min(appliedGiftCard.amount, finalAmount);
        await supabase
          .from('gift_cards')
          .update({ amount: appliedGiftCard.amount - usedAmount })
          .eq('id', appliedGiftCard.id);
      }

      // Create Ziina payment intent
      const aedAmount = Math.round(finalAmount * 3.67 * 100); // Convert to fils

      const ziinaPayload = {
        amount: aedAmount,
        currency_code: 'AED',
        message: `Order #${order.id.slice(-8)}`,
        success_url: `${window.location.origin}/order-success/${order.id}`,
        cancel_url: `${window.location.origin}/checkout`,
        failure_url: `${window.location.origin}/checkout`
      };

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.ziina_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ziinaPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Payment failed: ${response.status}`);
      }

      const ziinaData = await response.json();

      if (ziinaData.payment_url || ziinaData.redirect_url) {
        // Update order with payment ID
        await supabase
          .from('orders')
          .update({
            notes: JSON.stringify({ ziina_payment_id: ziinaData.id })
          })
          .eq('id', order.id);

        // Redirect to Ziina payment page
        const redirectUrl = ziinaData.payment_url || ziinaData.redirect_url;
        window.location.href = redirectUrl;
      } else {
        throw new Error('No redirect URL received from Ziina');
      }
    } catch (error: any) {
      onError(error.message || 'Payment processing failed');
      toast({
        title: "Payment Error",
        description: error.message || 'Payment processing failed',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Amount</span>
            <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {(finalAmount * 3.67).toFixed(2)} AED
            </span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-300">
            Secure payment powered by Ziina
          </p>
        </div>
        
        <Button
          onClick={processZiinaPayment}
          disabled={isProcessing || finalAmount <= 0}
          className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Smartphone className="h-4 w-4 mr-2" />
              Pay {(finalAmount * 3.67).toFixed(2)} AED
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
