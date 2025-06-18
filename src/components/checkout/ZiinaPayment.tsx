
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ZiinaPaymentProps {
  amount: number;
  orderData: any;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({
  amount,
  orderData,
  onSuccess,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleZiinaPayment = async () => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be greater than zero.",
        variant: "destructive"
      });
      onError("Invalid Amount");
      return;
    }

    setIsProcessing(true);
    try {
      // Get Ziina API key from site config
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_api_key')
        .single();

      if (configError || !configData?.value) {
        throw new Error('Ziina API key not configured');
      }

      const ziinaApiKey = configData.value as string;

      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          total_amount: amount,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'ziina',
          shipping_address: orderData.shipping_address || orderData,
          billing_address: orderData.billing_address || orderData,
          notes: orderData.notes || `Customer: ${orderData.name}, Email: ${orderData.email}, Phone: ${orderData.phone}`
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items if provided
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map((item: any) => ({
          order_id: order.id,
          product_id: item.product_id || item.id,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization || null
        }));

        await supabase.from('order_items').insert(orderItems);
      }

      // Convert to AED (assuming USD to AED conversion rate)
      const aedAmount = Math.round(amount * 3.67 * 100); // Convert to fils

      // Prepare Ziina payment request
      const paymentPayload = {
        currency_code: "AED",
        amount: aedAmount,
        message: `Order #${order.id.slice(-8)}`,
        success_url: `https://shopzyra.vercel.app/order-success/${order.id}`,
        cancel_url: "https://shopzyra.vercel.app/order-failed",
        failure_url: "https://shopzyra.vercel.app/order-failed",
        test: true, // Set to false for production
        transaction_source: "directApi"
      };

      console.log("Initiating Ziina Payment:", paymentPayload);

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload)
      });

      const responseData = await response.json();
      console.log("Ziina Response:", responseData);

      if (!response.ok) {
        const errorMessage = responseData.message || responseData.error?.message || `Payment failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      // Update order with payment intent ID
      if (responseData.id) {
        await supabase
          .from('orders')
          .update({ 
            payment_intent_id: responseData.id,
            notes: JSON.stringify({ 
              ziina_payment_id: responseData.id,
              customer_info: orderData
            })
          })
          .eq('id', order.id);
      }

      // Check for redirect URL
      const redirectUrl = responseData.next_action_url || 
                          responseData.payment_url || 
                          responseData.redirect_url ||
                          responseData.checkout_url;

      if (redirectUrl) {
        toast({
          title: "Redirecting to Payment",
          description: "You will be redirected to Ziina to complete payment.",
        });
        
        onSuccess({ ...responseData, order_id: order.id });
        
        // Redirect to Ziina payment page
        window.location.href = redirectUrl;
      } else if (responseData.status === 'succeeded') {
        // Payment completed immediately
        await supabase
          .from('orders')
          .update({ 
            payment_status: 'paid',
            status: 'processing'
          })
          .eq('id', order.id);
          
        onSuccess({ ...responseData, order_id: order.id });
        window.location.href = `/order-success/${order.id}`;
      } else {
        throw new Error("No payment URL received from Ziina");
      }

    } catch (error: any) {
      console.error('Ziina payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Could not initiate payment.",
        variant: "destructive",
      });
      onError(error.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <Smartphone className="h-6 w-6" />
            <span className="font-semibold text-lg">Pay with Ziina</span>
          </div>

          <p className="text-gray-600 dark:text-gray-300">
            Secure payment powered by Ziina. You will be redirected to complete the payment.
          </p>

          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            AED {(amount * 3.67).toFixed(2)}
          </div>

          <Button
            onClick={handleZiinaPayment}
            disabled={isProcessing || amount <= 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 mr-2" />
                Pay AED {(amount * 3.67).toFixed(2)}
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure payment • SSL encrypted • Test mode active
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
