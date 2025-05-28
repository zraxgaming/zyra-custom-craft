
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Loader2 } from 'lucide-react';

interface ZiinaPaymentProps {
  amount: number;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  orderData?: any;
  disabled?: boolean;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({
  amount,
  onSuccess,
  onError,
  orderData = {},
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleZiinaPayment = async () => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          total_amount: amount,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'ziina',
          currency: 'AED',
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address,
          delivery_type: orderData.delivery_type || 'standard'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items if provided
      if (orderData.items && orderData.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(
            orderData.items.map((item: any) => ({
              order_id: order.id,
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
              customization: item.customization
            }))
          );

        if (itemsError) throw itemsError;
      }

      // Get Ziina configuration
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['ziina_api_key', 'ziina_merchant_id']);

      if (configError) throw configError;

      const config = configData.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as any);

      if (!config.ziina_api_key) {
        throw new Error('Ziina payment is not configured. Please contact support.');
      }

      // Create Ziina payment
      const ziinaPayload = {
        amount: Math.round(amount * 367), // Convert USD to AED fils (1 USD = 3.67 AED, 1 AED = 100 fils)
        currency_code: 'AED',
        message: `Order payment for ${orderData.email || 'customer'}`,
        success_url: `${window.location.origin}/order-success/${order.id}`,
        cancel_url: `${window.location.origin}/checkout`,
        failure_url: `${window.location.origin}/checkout`,
        test: true, // Set to false for production
        transaction_source: 'directApi',
        allow_tips: false,
        customer_phone: orderData.phone || null
      };

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer W1LcJdWu9Y6v9/z3pb7o/ R7tARuTGnfnkUmcZQ3HoAuPPuJlTIP7AlY2vWO7DewJ`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ziinaPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ziina API error:', response.status, errorText);
        throw new Error(`Payment processing failed: ${response.status}`);
      }

      const ziinaData = await response.json();
      
      if (ziinaData.payment_url || ziinaData.checkout_url) {
        // Update order with payment ID
        await supabase
          .from('orders')
          .update({
            notes: JSON.stringify({ ziina_payment_id: ziinaData.id || ziinaData.payment_intent_id })
          })
          .eq('id', order.id);

        // Open payment page
        window.open(ziinaData.payment_url || ziinaData.checkout_url, '_blank');
        
        toast({
          title: "Payment Initiated",
          description: "Redirecting to Ziina payment page...",
        });
        
        // Simulate success for now (in real implementation, this would be handled by webhook)
        setTimeout(() => {
          onSuccess(order.id);
        }, 3000);
      } else {
        throw new Error('Invalid payment response from Ziina');
      }
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      const errorMessage = error.message || 'Payment processing failed';
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleZiinaPayment}
      disabled={disabled || loading}
      className="w-full"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay with Ziina (AED {(amount * 3.67).toFixed(2)})
        </>
      )}
    </Button>
  );
};

export default ZiinaPayment;
