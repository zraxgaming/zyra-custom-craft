
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Loader2, Smartphone, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ZiinaPaymentProps {
  amount: number;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  items: any[];
  shippingData: any;
  disabled?: boolean;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({
  amount,
  onSuccess,
  onError,
  items,
  shippingData,
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const handleZiinaPayment = async () => {
    if (amount <= 0) {
      const error = "Please enter a valid amount";
      setErrorMessage(error);
      toast({
        title: "Invalid Amount",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (!shippingData?.phone) {
      const error = "Phone number is required for Ziina payments";
      setErrorMessage(error);
      toast({
        title: "Missing Information",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    try {
      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: shippingData.user_id,
          total_amount: amount,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'ziina',
          currency: 'AED',
          shipping_address: shippingData,
          billing_address: shippingData,
          delivery_type: 'standard'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items if provided
      if (items && items.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(
            items.map((item: any) => ({
              order_id: order.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              customization: item.customization || null
            }))
          );

        if (itemsError) throw itemsError;
      }

      // Convert USD to AED (1 USD = 3.67 AED approximately)
      const aedAmount = Math.round(amount * 367); // Convert to fils (1 AED = 100 fils)

      // Create Ziina payment intent using direct API call
      const ziinaPayload = {
        amount: aedAmount,
        currency_code: 'AED',
        message: `Order #${order.id.slice(-8)} - Zyra Custom Craft`,
        success_url: `${window.location.origin}/order-success/${order.id}`,
        cancel_url: `${window.location.origin}/checkout`,
        failure_url: `${window.location.origin}/order-failed?order=${order.id}`,
        customer_phone: shippingData.phone,
        test: true, // Set to false for production
        transaction_source: "directApi",
        allow_tips: false
      };

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer m4+Pg5S4Qu+L4naXkkfCElwkJUr9ykZeafvKPfkDJQOSGnAs/4d7DDeB ml9Dwlls`,
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
        // Store order ID for later reference
        localStorage.setItem('pending_order_id', order.id);
        
        // Update order with payment details
        await supabase
          .from('orders')
          .update({
            notes: JSON.stringify({ 
              ziina_payment_id: ziinaData.id || ziinaData.payment_intent_id,
              payment_url: ziinaData.payment_url || ziinaData.checkout_url
            })
          })
          .eq('id', order.id);

        toast({
          title: "Redirecting to Payment",
          description: "You will be redirected to Ziina to complete your payment...",
        });

        // Redirect to Ziina payment page
        window.location.href = ziinaData.payment_url || ziinaData.checkout_url;
      } else {
        throw new Error('No payment URL received from Ziina');
      }
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      const errorMsg = error.message || 'Payment processing failed. Please try again.';
      setErrorMessage(errorMsg);
      
      toast({
        title: "Payment Error",
        description: errorMsg,
        variant: "destructive",
      });
      
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {errorMessage && (
        <Alert variant="destructive" className="animate-shake">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full animate-pulse">
            <Smartphone className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">Ziina Payment</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">Secure payment via Ziina UAE</p>
          </div>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
            <span className="text-blue-700 dark:text-blue-300">Amount (USD):</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
            <span className="text-blue-700 dark:text-blue-300">Amount (AED):</span>
            <span className="font-semibold">{(amount * 3.67).toFixed(2)} AED</span>
          </div>
          <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 p-2">
            <span>Exchange Rate:</span>
            <span>1 USD = 3.67 AED</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleZiinaPayment}
        disabled={disabled || loading || !shippingData?.phone}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pay {(amount * 3.67).toFixed(2)} AED with Ziina
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground animate-fade-in">
        You will be redirected to Ziina's secure payment page to complete your transaction.
        Supported payment methods: Credit/Debit Cards, Apple Pay, Google Pay
      </p>
    </div>
  );
};

export default ZiinaPayment;
