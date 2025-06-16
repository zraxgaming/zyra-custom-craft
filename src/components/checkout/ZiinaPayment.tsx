
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ZiinaPaymentProps {
  amount: number;
  orderPayload: any;
  onSuccess: (paymentIntentData: any) => void;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({
  amount,
  orderPayload,
  onSuccess,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleInitiatePayment = async () => {
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
      // Get Ziina API key from site_config
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_api_key')
        .single();

      if (configError || !configData?.value) {
        throw new Error('Ziina API key not configured in site settings');
      }

      const ziinaApiKey = configData.value as string;
      
      // Convert amount to fils (AED smallest unit)
      const amountInFils = Math.round(amount * 100);

      // Get environment flag - default to sandbox/test mode
      const { data: envData } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_env')
        .single();
        
      const isTestMode = !envData?.value || envData.value !== 'production';

      // Use sandbox endpoint for testing
      const ziinaEndpoint = isTestMode
        ? 'https://sandbox-api-v2.ziina.com/v1/payments'
        : 'https://api-v2.ziina.com/v1/payments';

      const paymentPayload = {
        amount: amountInFils,
        currency: "AED",
        description: `Order #${orderPayload.orderId || "N/A"}`,
        metadata: {
          order_id: orderPayload.orderId || "N/A",
          customer_email: orderPayload.customerEmail || "",
          test_mode: isTestMode
        },
        success_url: `${window.location.origin}/order-success?source=ziina&order_id=${orderPayload.orderId}`,
        cancel_url: `${window.location.origin}/checkout?cancelled=true`,
        webhook_url: `${window.location.origin}/api/ziina-webhook`
      };

      console.log("Initiating Ziina Payment with payload:", paymentPayload);
      console.log("Using endpoint:", ziinaEndpoint);
      console.log("Test mode:", isTestMode);

      const response = await fetch(ziinaEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload)
      });

      const responseData = await response.json();
      console.log("Ziina API Response:", responseData);

      if (!response.ok) {
        const errorMessage = responseData.message || 
                           responseData.error?.message || 
                           responseData.detail ||
                           `Ziina API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      // Handle successful payment intent creation
      const paymentUrl = responseData.payment_url || 
                        responseData.checkout_url || 
                        responseData.hosted_checkout_url ||
                        responseData.redirect_url;

      if (paymentUrl && responseData.id) {
        console.log("Redirecting to Ziina payment page:", paymentUrl);
        onSuccess(responseData);
        
        // Store payment intent in order notes for tracking
        if (orderPayload.orderId) {
          await supabase
            .from('orders')
            .update({
              notes: JSON.stringify({ 
                ziina_payment_id: responseData.id,
                ziina_payment_url: paymentUrl,
                test_mode: isTestMode
              })
            })
            .eq('id', orderPayload.orderId);
        }

        // Redirect to Ziina payment page
        window.location.href = paymentUrl;
      } else {
        throw new Error("No payment URL received from Ziina API");
      }

    } catch (error: any) {
      console.error('Ziina payment initiation error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Could not initiate Ziina payment.",
        variant: "destructive",
      });
      onError(error.message || "Could not initiate Ziina payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <Smartphone className="h-6 w-6" />
            <span className="font-semibold text-lg">Ziina Payment</span>
          </div>

          <p className="text-gray-600 dark:text-gray-300">
            Pay securely with Ziina. You will be redirected to complete the payment.
          </p>

          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            AED {amount.toFixed(2)}
          </div>

          <Button
            onClick={handleInitiatePayment}
            disabled={isProcessing || amount <= 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 mr-2" />
                Pay with Ziina
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure payment powered by Ziina • Test Mode
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
