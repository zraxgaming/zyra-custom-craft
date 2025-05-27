
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, Loader2, CreditCard, Shield } from "lucide-react";

interface ZiinaPaymentProps {
  amount: number;
  orderData: any;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({ 
  amount, 
  orderData, 
  onSuccess, 
  onError 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ziinaApiKey, setZiinaApiKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchZiinaConfig();
  }, []);

  const fetchZiinaConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_api_key')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data?.value) {
        setZiinaApiKey(data.value as string);
      }
    } catch (error) {
      console.error('Error fetching Ziina config:', error);
      onError('Ziina payment not configured. Please contact support.');
    }
  };

  const handleZiinaPayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Required",
        description: "Please enter your UAE phone number",
        variant: "destructive"
      });
      return;
    }

    if (!ziinaApiKey) {
      onError('Ziina API not configured. Please contact support.');
      return;
    }

    setIsProcessing(true);
    
    try {
      const aedAmount = Math.round(amount * 3.67);
      
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: aedAmount,
          currency_code: "AED",
          message: `Order payment for ${orderData.email || 'customer'}`,
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/checkout`,
          failure_url: `${window.location.origin}/order-failed`,
          test: false,
          transaction_source: "directApi",
          allow_tips: false
        })
      };

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', options);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Ziina API error: ${response.status} - ${errorData}`);
      }

      const ziinaData = await response.json();

      if (ziinaData.payment_url || ziinaData.checkout_url) {
        // Store payment info for verification
        localStorage.setItem('pending_ziina_payment', JSON.stringify({
          payment_intent_id: ziinaData.id,
          amount: amount,
          order_data: orderData
        }));
        
        // Redirect to Ziina checkout
        window.location.href = ziinaData.payment_url || ziinaData.checkout_url;
      } else {
        throw new Error('Invalid payment response from Ziina');
      }
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      onError(error.message || 'Ziina payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const aedAmount = (amount * 3.67).toFixed(2);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Professional Header */}
      <div className="text-center p-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/30 dark:via-gray-900 dark:to-pink-950/30 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 animate-scale-in shadow-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 animate-pulse-gentle">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Secure Payment</h3>
        <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
          AED {aedAmount} (≈ ${amount.toFixed(2)} USD)
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-600 dark:text-gray-400">
          <Shield className="h-4 w-4" />
          <span>Protected by Ziina</span>
        </div>
      </div>
      
      {/* Phone Input */}
      <div className="animate-slide-in-up space-y-3">
        <Label htmlFor="phone" className="text-base font-semibold text-gray-900 dark:text-white">UAE Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+971 50 123 4567"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="h-12 text-lg bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-500 rounded-xl shadow-sm"
        />
      </div>
      
      {/* Payment Button */}
      <Button
        onClick={handleZiinaPayment}
        disabled={isProcessing || !phoneNumber || !ziinaApiKey}
        className="w-full h-14 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-pulse-gentle"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Smartphone className="h-6 w-6" />
            <span>Pay AED {aedAmount} with Ziina</span>
          </div>
        )}
      </Button>
      
      {/* Security Notice */}
      <div className="text-center space-y-2 animate-fade-in">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Shield className="h-4 w-4" />
          <span>256-bit SSL encrypted payment</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Powered by Ziina Payment Gateway - Licensed by Central Bank of UAE
        </p>
      </div>
    </div>
  );
};

export default ZiinaPayment;
