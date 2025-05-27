
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, Loader2 } from "lucide-react";

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
        .in('key', ['ziina_api_key', 'ziina_merchant_id', 'ziina_base_url']);

      if (error) throw error;

      const config = data.reduce((acc, item) => {
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

    if (!ziinaConfig?.ziina_api_key) {
      onError('Ziina API not configured');
      return;
    }

    setIsProcessing(true);
    
    try {
      const aedAmount = amount * 3.67;
      
      const response = await fetch(`${ziinaConfig.ziina_base_url || 'https://api.ziina.com'}/v1/payment_intents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaConfig.ziina_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(aedAmount * 100),
          currency: 'AED',
          customer: {
            phone: phoneNumber,
            email: orderData.email,
            name: `${orderData.firstName} ${orderData.lastName}`
          },
          description: `Order payment for ${orderData.email}`,
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/checkout`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Ziina payment');
      }

      const paymentData = await response.json();
      
      if (paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        toast({
          title: "Payment Successful",
          description: `Ziina payment of AED ${aedAmount.toFixed(2)} completed`,
        });
        onSuccess(`ziina_${Date.now()}`);
      }
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      onError(error.message || 'Ziina payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const aedAmount = amount * 3.67;

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
        <p className="text-sm text-purple-700 dark:text-purple-300">
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
        disabled={isProcessing || !phoneNumber}
        className="w-full bg-purple-600 hover:bg-purple-700"
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
