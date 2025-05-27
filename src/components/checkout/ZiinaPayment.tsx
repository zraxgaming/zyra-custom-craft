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
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchZiinaConfig();
  }, []);

  const fetchZiinaConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['ziina_api_key', 'ziina_merchant_id', 'ziina_base_url']);

      if (error) throw error;

      const config = data?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as any);

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
        test: false,
        transaction_source: 'directApi',
        allow_tips: false,
        customer_phone: phoneNumber
      };

      // Call Ziina API directly
      const ziinaBaseUrl = ziinaConfig.ziina_base_url || 'https://api-v2.ziina.com';
      const response = await fetch(`${ziinaBaseUrl}/api/payment_intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaConfig.ziina_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Ziina API error: ${response.status} - ${errorText}`);
        throw new Error(`Payment gateway error: ${response.status}`);
      }

      const ziinaData = await response.json();
      // Use redirect_url, payment_url, or checkout_url for redirection
      const url = ziinaData.redirect_url || ziinaData.payment_url || ziinaData.checkout_url;
      if (url) {
        // Store payment info for verification (no sensitive data)
        localStorage.setItem('pending_ziina_payment', JSON.stringify({
          payment_id: ziinaData.id || ziinaData.payment_intent_id,
          amount: amount,
          order_data: orderData
        }));
        
        toast({
          title: "Redirecting to Ziina",
          description: "You will be redirected to complete your payment securely.",
        });
        setPaymentUrl(url); // Open modal with iframe
      } else {
        throw new Error('No payment URL received from Ziina');
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

  // Listen for payment completion via postMessage or polling
  useEffect(() => {
    if (!paymentUrl) return;
    // Handler for postMessage from payment page
    const handleMessage = async (event: MessageEvent) => {
      // Only accept messages from the payment domain
      if (typeof paymentUrl === 'string' && event.origin && paymentUrl.startsWith(event.origin)) {
        if (event.data && event.data.status === 'success' && orderData?.id) {
          await supabase.from('orders').update({ status: 'processing', payment_status: 'paid' }).eq('id', orderData.id);
          setPaymentUrl(null);
          onSuccess(orderData.id);
          window.location.href = `/order-success?id=${orderData.id}`;
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [paymentUrl, orderData, onSuccess]);

  // Optionally, poll the order status if postMessage is not supported
  useEffect(() => {
    let interval: any;
    if (paymentUrl && orderData?.id) {
      interval = setInterval(async () => {
        const { data } = await supabase.from('orders').select('payment_status').eq('id', orderData.id).single();
        if (data?.payment_status === 'paid') {
          setPaymentUrl(null);
          onSuccess(orderData.id);
          window.location.href = `/order-success?id=${orderData.id}`;
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [paymentUrl, orderData, onSuccess]);

  const aedAmount = (amount * 3.67).toFixed(2);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Header */}
      <div className="text-center p-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/30 dark:via-gray-900 dark:to-pink-950/30 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 animate-scale-in shadow-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-6 animate-float shadow-xl">
          <CreditCard className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Secure Payment via Ziina</h3>
        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
          AED {aedAmount} 
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          (≈ ${amount.toFixed(2)} USD)
        </p>
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          {ziinaConfig?.ziina_api_key ? (
            <>
              <Shield className="h-5 w-5 text-green-600" />
              <span>Bank-grade security powered by Ziina</span>
              <Zap className="h-5 w-5 text-yellow-600 animate-pulse" />
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>Payment gateway configuration required</span>
            </>
          )}
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
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>• Required for payment verification and order updates</p>
          <p>• Supported formats: +971501234567, 0501234567, 971501234567</p>
        </div>
      </div>
      
      {/* Payment Button */}
      <Button
        onClick={handleZiinaPayment}
        disabled={isProcessing || !phoneNumber || !ziinaConfig?.ziina_api_key}
        className="w-full h-16 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] animate-bounce-in disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-4">
            <Loader2 className="h-7 w-7 animate-spin" />
            <span>Redirecting to Ziina...</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Smartphone className="h-7 w-7" />
            <span>Pay AED {aedAmount} with Ziina</span>
            <Zap className="h-6 w-6 animate-pulse" />
          </div>
        )}
      </Button>
      
      {/* Modal for Ziina payment */}
      {paymentUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 max-w-2xl w-full relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
              onClick={() => setPaymentUrl(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Complete Your Payment</h2>
            <iframe
              src={paymentUrl}
              title="Ziina Payment"
              className="w-full h-[600px] rounded-lg border"
              allow="payment"
              onLoad={() => setIframeLoaded(true)}
            />
            {!iframeLoaded && <div className="text-center text-gray-500 mt-2">Loading payment page...</div>}
            <p className="mt-2 text-sm text-gray-500 text-center">After completing payment, you will be redirected automatically.</p>
          </div>
        </div>
      )}
      
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
        {ziinaConfig?.ziina_api_key ? (
          <>
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Real Ziina Payment Integration</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>You will be redirected to Ziina's secure payment page.</strong> Complete your payment and you'll be redirected back automatically.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Payment Gateway Not Configured</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please contact the administrator to configure Ziina payment settings.
            </p>
          </>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Powered by Ziina Payment Gateway - Licensed by Central Bank of UAE
        </p>
      </div>
    </div>
  );
};

export default ZiinaPayment;

// NOTE: Do not log or expose API keys or sensitive config in frontend logs or UI.
