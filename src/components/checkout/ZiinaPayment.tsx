
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, Loader2, CreditCard, Shield, Zap, CheckCircle, AlertCircle } from "lucide-react";

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
      // Convert USD to AED and then to fils (1 AED = 100 fils)
      const aedAmount = amount * 3.67;
      const filsAmount = Math.round(aedAmount * 100); // Convert to fils
      
      console.log(`Converting $${amount} USD to ${aedAmount} AED to ${filsAmount} fils`);
      
      const paymentPayload = {
        amount: filsAmount, // Amount in fils
        currency_code: "AED",
        message: `Order payment for ${orderData.email || 'customer'}`,
        success_url: `${window.location.origin}/order-success`,
        cancel_url: `${window.location.origin}/checkout`,
        failure_url: `${window.location.origin}/order-failed`,
        test: false,
        transaction_source: "directApi",
        allow_tips: false,
        customer_phone: phoneNumber
      };

      console.log('Sending Ziina payment request:', paymentPayload);

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentPayload)
      });

      const responseText = await response.text();
      console.log('Ziina response status:', response.status);
      console.log('Ziina response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`Ziina API error: ${response.status} - ${responseText}`);
      }

      let ziinaData;
      try {
        ziinaData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from Ziina API');
      }

      console.log('Parsed Ziina data:', ziinaData);

      if (ziinaData.payment_url || ziinaData.checkout_url) {
        // Store payment info for verification
        localStorage.setItem('pending_ziina_payment', JSON.stringify({
          payment_intent_id: ziinaData.id,
          amount: amount,
          order_data: orderData
        }));
        
        // Open Ziina checkout in new tab
        const paymentUrl = ziinaData.payment_url || ziinaData.checkout_url;
        window.open(paymentUrl, '_blank');
        
        toast({
          title: "Payment Window Opened",
          description: "Complete your payment in the new tab, then return here.",
        });
      } else {
        throw new Error('No payment URL received from Ziina');
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
      {/* Premium Header */}
      <div className="text-center p-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/30 dark:via-gray-900 dark:to-pink-950/30 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 animate-scale-in shadow-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-6 animate-float shadow-xl">
          <CreditCard className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 animate-text-shimmer">Secure Payment via Ziina</h3>
        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
          AED {aedAmount} 
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          (≈ ${amount.toFixed(2)} USD)
        </p>
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <Shield className="h-5 w-5 text-green-600" />
          <span>Bank-grade security powered by Ziina</span>
          <Zap className="h-5 w-5 text-yellow-600 animate-pulse" />
        </div>
      </div>
      
      {/* Phone Input */}
      <div className="animate-slide-in-up space-y-4">
        <Label htmlFor="phone" className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-purple-600" />
          UAE Mobile Number *
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+971 50 123 4567"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="h-14 text-lg bg-white/90 dark:bg-gray-800/90 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-500 rounded-xl shadow-lg focus:shadow-xl"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Required for payment verification and order updates
        </p>
      </div>
      
      {/* Payment Button */}
      <Button
        onClick={handleZiinaPayment}
        disabled={isProcessing || !phoneNumber || !ziinaApiKey}
        className="w-full h-16 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] animate-bounce-in disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-4">
            <Loader2 className="h-7 w-7 animate-spin" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Smartphone className="h-7 w-7" />
            <span>Pay AED {aedAmount} with Ziina</span>
            <Zap className="h-6 w-6 animate-pulse" />
          </div>
        )}
      </Button>
      
      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
          <Shield className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-400">Bank Security</p>
            <p className="text-sm text-green-600 dark:text-green-500">256-bit encryption</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-400">Licensed Gateway</p>
            <p className="text-sm text-blue-600 dark:text-blue-500">UAE Central Bank</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
          <Zap className="h-6 w-6 text-purple-600" />
          <div>
            <p className="font-medium text-purple-800 dark:text-purple-400">Instant Processing</p>
            <p className="text-sm text-purple-600 dark:text-purple-500">Real-time verification</p>
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="text-center space-y-3 animate-fade-in p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Amount correctly formatted for Ziina (fils)</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 <strong>Payment will open in a new tab.</strong> Complete your payment and return here to continue.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Powered by Ziina Payment Gateway - Licensed by Central Bank of UAE
        </p>
      </div>
    </div>
  );
};

export default ZiinaPayment;
