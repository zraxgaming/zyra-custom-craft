
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Loader2, Smartphone, AlertCircle, Shield, Zap, CheckCircle } from 'lucide-react';
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
        title: "Invalid Amount ⚠️",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (!shippingData?.phone) {
      const error = "Phone number is required for Ziina payments";
      setErrorMessage(error);
      toast({
        title: "Missing Information 📞",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    try {
      // Get Ziina API key from site_config
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_api_key')
        .single();

      if (configError || !configData?.value) {
        throw new Error('Ziina API key not configured in site settings');
      }

      const ziinaApiKey = configData.value;

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

      // Create Ziina payment intent using API key from site_config
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

      console.log('Ziina Payment Payload:', ziinaPayload);

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(ziinaPayload)
      });

      console.log('Ziina API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ziina API error:', response.status, errorText);
        throw new Error(`Payment processing failed: ${response.status} - ${errorText}`);
      }

      const ziinaData = await response.json();
      console.log('Ziina Response:', ziinaData);

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
          title: "Redirecting to Payment 🚀",
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
        title: "Payment Error 💥",
        description: errorMsg,
        variant: "destructive",
      });
      
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {errorMessage && (
        <Alert variant="destructive" className="animate-shake border-red-300 dark:border-red-700">
          <AlertCircle className="h-4 w-4 animate-pulse" />
          <AlertDescription className="font-medium">{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-2xl border-2 border-blue-200 dark:border-blue-800 animate-scale-in shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl animate-pulse-glow shadow-lg">
            <Smartphone className="h-8 w-8 text-white animate-float" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-text-shimmer">
              Ziina Payment Gateway
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="h-4 w-4 text-green-500 animate-pulse" />
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Secure & Trusted Payment in UAE
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Zap className="h-4 w-4 animate-bounce" />
              <span className="text-xs font-semibold">Instant</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 animate-slide-in-left">
              <div className="flex justify-between items-center">
                <span className="text-blue-700 dark:text-blue-300 font-medium">Amount (USD):</span>
                <span className="font-bold text-lg animate-pulse">${amount.toFixed(2)}</span>
              </div>
            </div>
            <div className="p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 animate-slide-in-right">
              <div className="flex justify-between items-center">
                <span className="text-purple-700 dark:text-purple-300 font-medium">Amount (AED):</span>
                <span className="font-bold text-lg animate-pulse">{(amount * 3.67).toFixed(2)} AED</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg border border-green-200 dark:border-green-700 animate-bounce-in">
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-700 dark:text-green-300 font-medium">Exchange Rate:</span>
              <span className="font-semibold animate-text-glow">1 USD = 3.67 AED</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200 dark:border-amber-800 animate-scale-in">
          <div className="flex items-center justify-center gap-4 text-xs text-amber-700 dark:text-amber-300 font-medium">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 animate-pulse" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 animate-pulse" />
              <span>PCI Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 animate-bounce" />
              <span>Instant Processing</span>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleZiinaPayment}
        disabled={disabled || loading || !shippingData?.phone}
        className="w-full h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="animate-pulse">Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 animate-bounce" />
            <span className="animate-text-shimmer">
              Pay {(amount * 3.67).toFixed(2)} AED with Ziina
            </span>
          </div>
        )}
      </Button>

      <div className="text-center space-y-2 animate-fade-in">
        <p className="text-xs text-muted-foreground">
          🔒 You will be redirected to Ziina's secure payment page
        </p>
        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
          ✅ Supported: Credit/Debit Cards • Apple Pay • Google Pay • Bank Transfer
        </p>
      </div>
    </div>
  );
};

export default ZiinaPayment;
