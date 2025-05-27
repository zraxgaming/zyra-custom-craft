
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
      const aedAmount = Math.round(amount * 3.67 * 100); // Convert to fils
      
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: aedAmount,
          currency_code: "AED",
          message: `Order payment for ${orderData.email}`,
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/checkout`,
          failure_url: `${window.location.origin}/checkout`,
          test: false,
          transaction_source: "directApi",
          allow_tips: false
        })
      };

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', options);
      
      if (!response.ok) {
        throw new Error(`Ziina API error: ${response.status}`);
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

  const aedAmount = amount * 3.67;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200 dark:border-purple-800/50 animate-scale-in">
        <CreditCard className="h-8 w-8 mx-auto mb-3 text-purple-600 dark:text-purple-400 animate-float" />
        <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
          Amount: AED {aedAmount.toFixed(2)} (≈ ${amount.toFixed(2)} USD)
        </p>
      </div>
      
      <div className="animate-slide-in-up">
        <Label htmlFor="phone" className="text-base font-medium text-foreground">UAE Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+971 50 123 4567"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-2 bg-background/50 border-border/50 focus:border-primary transition-all duration-300 hover:border-primary/50"
        />
      </div>
      
      <Button
        onClick={handleZiinaPayment}
        disabled={isProcessing || !phoneNumber || !ziinaApiKey}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 py-6 text-lg font-semibold animate-pulse-gentle"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing Ziina Payment...
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5" />
            Pay AED {aedAmount.toFixed(2)} with Ziina
          </div>
        )}
      </Button>
      
      <div className="text-xs text-center text-muted-foreground animate-fade-in">
        <p>🔒 Secure payment via Ziina Payment Gateway</p>
      </div>
    </div>
  );
};

export default ZiinaPayment;
