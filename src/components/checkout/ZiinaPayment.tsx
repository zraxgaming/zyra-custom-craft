
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Added for error toasts

interface ZiinaPaymentProps {
  amount: number;
  orderPayload: any; // Payload to describe the order for Ziina if needed (e.g. referenceId, customer info)
  onSuccess: (paymentIntentData: any) => void; // Callback on successful payment intent creation
  onError: (error: string) => void; // Callback on error
  // isProcessing is managed by this component now
}

// IMPORTANT: Hardcoding API keys in client-side code is a major security risk.
// This key will be visible in network requests and bundled JavaScript.
// For production, use server-side processing (like Supabase Edge Functions) to protect your API key.
const ZIINA_API_KEY = "m4+Pg5S4Qu+L4naXkkfClwkJUr9ykZeafvKPfkDJQOSGnAs/4d7DDeBml9Dwlls";

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({
  amount,
  orderPayload, // You might use this to pass order_id or other references
  onSuccess,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleInitiatePayment = async () => {
    if (amount <= 0) {
      toast({ title: "Invalid Amount", description: "Payment amount must be greater than zero.", variant: "destructive" });
      onError("Invalid Amount");
      return;
    }

    setIsProcessing(true);
    try {
      // Ziina expects amount in the smallest currency unit (e.g., fils for AED, cents for USD)
      // Assuming AED, so amount * 100
      const amountInFils = Math.round(amount * 100);

      const body = {
        amount: amountInFils,
        currency_code: "AED", // Or make this configurable
        // You can add more details like reference_id, customer, items as per Ziina docs
        // e.g., reference_id: orderPayload.orderId,
        metadata: orderPayload.metadata || { order_id: orderPayload.orderId || "N/A" },
        success_url: `${window.location.origin}/order-success?source=ziina`, // Adjust as needed
        cancel_url: `${window.location.origin}/checkout?source=ziina&status=cancelled`, // Adjust as needed
        failure_url: `${window.location.origin}/checkout?source=ziina&status=failed`, // Adjust as needed
      };

      console.log("Initiating Ziina Payment with payload:", body);
      console.log("Using API Key (first 5 chars):", ZIINA_API_KEY.substring(0,5));


      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ZIINA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Ziina API Error:", responseData);
        const errorMessage = responseData.message || responseData.error?.message || `Ziina API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      
      console.log("Ziina Payment Intent Created:", responseData);

      if (responseData.next_action_url) {
        onSuccess(responseData); // Pass the full response data
        // Redirecting to Ziina's payment page
        window.location.href = responseData.next_action_url;
      } else if (responseData.id && responseData.status === 'succeeded') {
        // This case might happen for very quick confirmations or specific scenarios
        onSuccess(responseData);
      }
       else {
        console.error("Ziina response missing next_action_url or success status:", responseData);
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
          <p className="text-xs text-red-500 dark:text-red-400 font-semibold mt-2">
            Warning: API Key is currently client-side. For production, use server-side processing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
