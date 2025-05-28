
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
  const [ziinaConfig, setZiinaConfig] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchZiinaConfig();
  }, []);

  const fetchZiinaConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['ziina_api_key']);

      if (error) throw error;

      const config = data?.reduce((acc, item) => {
        acc[item.key] = typeof item.value === 'string' ? item.value : String(item.value);
        return acc;
      }, {} as Record<string, string>) || {};

      setZiinaConfig(config);
    } catch (error) {
      console.error('Error fetching Ziina config:', error);
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

    // Validate UAE phone number format
    const uaePhoneRegex = /^(\+971|00971|971|0)?[1-9][0-9]{8}$/;
    if (!uaePhoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid UAE phone number",
        variant: "destructive"
      });
      return;
    }

    if (!ziinaConfig?.ziina_api_key) {
      toast({
        title: "Configuration Error",
        description: "Ziina payment gateway is not properly configured. Please contact support.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Convert USD to AED and then to fils (1 AED = 100 fils)
      const aedAmount = amount * 3.67;
      const filsAmount = Math.round(aedAmount * 100);

      const paymentPayload = {
        amount: filsAmount,
        currency_code: 'AED',
        message: `Order payment for ${orderData?.email || 'customer'}`,
        success_url: `${window.location.origin}/order-success`,
        cancel_url: `${window.location.origin}/checkout`,
        failure_url: `${window.location.origin}/order-failed`,
        test: true,
        transaction_source: 'directApi',
        allow_tips: false,
        customer_phone: phoneNumber
      };

      // Call Ziina API directly
      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaConfig.ziina_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Payment gateway error: ${response.status}`);
      }

      const ziinaData = await response.json();
      
      // Extract redirect URL - Ziina can return different field names
      const redirectUrl = ziinaData.redirect_url || ziinaData.payment_url || ziinaData.checkout_url;
      
      if (redirectUrl) {
        // Store payment info for verification
        localStorage.setItem('pending_ziina_payment', JSON.stringify({
          payment_id: ziinaData.id || ziinaData.payment_intent_id,
          amount: amount,
          order_data: orderData
        }));
        
        toast({
          title: "Redirecting to Ziina",
          description: "You will be redirected to complete your payment securely.",
        });
        
        // Redirect to Ziina payment page
        window.location.href = redirectUrl;
      } else {
        throw new Error('No redirect URL received from Ziina payment response');
      }
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      let errorMessage = 'Ziina payment failed. Please try again.';
      
      if (error.message.includes('404')) {
        errorMessage = 'Ziina API endpoint not found. Please check configuration.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Invalid Ziina API credentials. Please contact support.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid payment data. Please check your information.';
      }
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const aedAmount = (amount * 3.67).toFixed(2);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Professional Header */}
      <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/30 dark:via-gray-900 dark:to-indigo-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Secure Payment via Ziina</h3>
        <p className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-1">
          AED {aedAmount} 
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          (≈ ${amount.toFixed(2)} USD)
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          {ziinaConfig?.ziina_api_key ? (
            <>
              <Shield className="h-4 w-4 text-green-600" />
              <span>Bank-grade security powered by Ziina</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span>Payment gateway configuration required</span>
            </>
          )}
        </div>
      </div>
      
      {/* Phone Input */}
      <div className="space-y-3">
        <Label htmlFor="phone" className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-blue-600" />
          UAE Mobile Number *
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+971 50 123 4567"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="h-12 text-base bg-white/90 dark:bg-gray-800/90 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 rounded-lg"
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• Required for payment verification and order updates</p>
          <p>• Supported formats: +971501234567, 0501234567, 971501234567</p>
        </div>
      </div>
      
      {/* Payment Button */}
      <Button
        onClick={handleZiinaPayment}
        disabled={isProcessing || !phoneNumber || !ziinaConfig?.ziina_api_key}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Redirecting to Ziina...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5" />
            <span>Pay AED {aedAmount} with Ziina</span>
          </div>
        )}
      </Button>
      
      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <Shield className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-400 text-sm">Bank Security</p>
            <p className="text-xs text-green-600 dark:text-green-500">256-bit encryption</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-400 text-sm">Licensed Gateway</p>
            <p className="text-xs text-blue-600 dark:text-blue-500">UAE Central Bank</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <Zap className="h-5 w-5 text-purple-600" />
          <div>
            <p className="font-medium text-purple-800 dark:text-purple-400 text-sm">Instant Processing</p>
            <p className="text-xs text-purple-600 dark:text-purple-500">Real-time verification</p>
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="text-center space-y-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        {ziinaConfig?.ziina_api_key ? (
          <>
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium text-sm">Real Ziina Payment Integration</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              You will be redirected to Ziina's secure payment page to complete your transaction.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium text-sm">Payment Gateway Not Configured</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Please contact the administrator to configure Ziina payment settings.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ZiinaPayment;
