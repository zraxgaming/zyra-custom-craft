
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, Loader2, CreditCard } from "lucide-react";

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

      if (error) throw error;
      setZiinaApiKey(data?.value);
    } catch (error) {
      console.error('Error fetching Ziina config:', error);
      onError('Ziina payment not configured');
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
      onError('Ziina API not configured');
      return;
    }

    setIsProcessing(true);
    
    try {
      const aedAmount = amount * 3.67; // USD to AED conversion
      
      // Create payment intent with Ziina API
      const paymentPayload = {
        amount: Math.round(aedAmount * 100), // Amount in fils (AED cents)
        currency: 'AED',
        customer: {
          phone: phoneNumber,
          email: orderData.email,
          name: `${orderData.firstName} ${orderData.lastName}`
        },
        description: `Order payment for ${orderData.email}`,
        success_url: `${window.location.origin}/order-success`,
        cancel_url: `${window.location.origin}/checkout`,
        metadata: {
          order_id: `order_${Date.now()}`,
          customer_id: orderData.user_id
        }
      };

      console.log('Creating Ziina payment with payload:', paymentPayload);

      const response = await fetch('https://api.ziina.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Ziina API error response:', errorData);
        throw new Error(`Ziina API error: ${response.status}`);
      }

      const paymentData = await response.json();
      console.log('Ziina payment created:', paymentData);
      
      if (paymentData.checkout_url || paymentData.payment_url) {
        // Redirect to Ziina checkout
        window.location.href = paymentData.checkout_url || paymentData.payment_url;
      } else if (paymentData.status === 'succeeded') {
        // Payment completed immediately
        toast({
          title: "Payment Successful",
          description: `Ziina payment of AED ${aedAmount.toFixed(2)} completed`,
        });
        onSuccess(paymentData.id || `ziina_${Date.now()}`);
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

  const aedAmount = amount * 3.67;

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800">
        <CreditCard className="h-6 w-6 mx-auto mb-2 text-purple-600" />
        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
          Amount: AED {aedAmount.toFixed(2)} (≈ ${amount.toFixed(2)} USD)
        </p>
      </div>
      
      <div>
        <Label htmlFor="phone">UAE Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+971 50 123 4567"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1"
        />
      </div>
      
      <Button
        onClick={handleZiinaPayment}
        disabled={isProcessing || !phoneNumber || !ziinaApiKey}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Ziina Payment...
          </>
        ) : (
          <>
            <Smartphone className="h-4 w-4 mr-2" />
            Pay AED {aedAmount.toFixed(2)} with Ziina
          </>
        )}
      </Button>
      
      <div className="text-xs text-center text-muted-foreground">
        <p>🔒 Secure payment via Ziina Payment Gateway</p>
      </div>
    </div>
  );
};

export default ZiinaPayment;
