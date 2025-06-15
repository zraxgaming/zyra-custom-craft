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
      const amountInFils = Math.round(amount * 100);

      // Also get environment flag
      const { data: envData } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_env')
        .single();
      const ziinaEnv = envData?.value ?? 'test';

      // Choose endpoint:
      const ziinaEndpoint = ziinaEnv === "prod"
        ? 'https://api-v2.ziina.com/api/payment_intent'
        : 'https://sandbox-api-v2.ziina.com/api/payment_intent';

      const body = {
        amount: amountInFils,
        currency_code: "AED",
        metadata: orderPayload.metadata || { order_id: orderPayload.orderId || "N/A" },
        success_url: `${window.location.origin}/order-success?source=ziina`,
        cancel_url: `${window.location.origin}/checkout?source=ziina&status=cancelled`,
        failure_url: `${window.location.origin}/checkout?source=ziina&status=failed`,
      };

      console.log("Initiating Ziina Payment with payload:", body);

      const response = await fetch(ziinaEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.message || responseData.error?.message || `Ziina API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      // Try all possible redirect fields!
      const redirectUrl =
        responseData.next_action_url ||
        responseData.payment_url ||
        responseData.redirect_url;

      if (redirectUrl && responseData.id) {
        onSuccess(responseData);
        window.location.assign(redirectUrl);
      } else if (responseData.id && responseData.status === 'succeeded') {
        onSuccess(responseData);
      } else {
        throw new Error(responseData.message || "Failed to get payment redirection URL from Ziina.");
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
            Secure payment powered by Ziina
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
