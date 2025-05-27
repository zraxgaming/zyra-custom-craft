
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
      const aedAmount = amount * 3.67; // USD to AED conversion
      
      // Direct API call to Ziina without edge functions
      const response = await fetch('https://api.ziina.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(aedAmount * 100), // Amount in fils
          currency: 'AED',
          customer_phone: phoneNumber,
          customer_email: orderData.email,
          customer_name: `${orderData.firstName} ${orderData.lastName}`,
          description: `Order payment for ${orderData.email}`,
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/checkout`,
          reference: `order_${Date.now()}`,
        })
      });

      if (!response.ok) {
        throw new Error(`Ziina API error: ${response.status}`);
      }

      const ziinaData = await response.json();

      if (ziinaData.payment_url || ziinaData.checkout_url) {
        // Redirect to Ziina checkout
        window.location.href = ziinaData.payment_url || ziinaData.checkout_url;
      } else if (ziinaData.status === 'succeeded') {
        toast({
          title: "Payment Successful",
          description: `Ziina payment of AED ${aedAmount.toFixed(2)} completed`,
        });
        onSuccess(ziinaData.id || `ziina_${Date.now()}`);
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
      <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800/50">
        <CreditCard className="h-6 w-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
          Amount: AED {aedAmount.toFixed(2)} (≈ ${amount.toFixed(2)} USD)
        </p>
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-foreground">UAE Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+971 50 123 4567"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 bg-background/50 border-border/50 focus:border-primary transition-colors"
        />
      </div>
      
      <Button
        onClick={handleZiinaPayment}
        disabled={isProcessing || !phoneNumber || !ziinaApiKey}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
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
