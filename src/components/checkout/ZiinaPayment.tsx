
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ZiinaPaymentProps {
  amount: number;
  orderData: any;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({ amount, orderData, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ziinaConfig, setZiinaConfig] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchZiinaConfig();
  }, []);

  const fetchZiinaConfig = async () => {
    try {
      const { data: configData, error } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['ziina_api_key', 'ziina_base_url']);

      if (error) throw error;
      
      const config: any = {};
      if (configData && Array.isArray(configData)) {
        configData.forEach((item: any) => {
          config[item.key] = item.value;
        });
      }
      
      setZiinaConfig(config);
    } catch (error) {
      console.error('Error fetching Ziina config:', error);
    }
  };

  const handleZiinaPayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number for Ziina payment",
        variant: "destructive",
      });
      return;
    }

    if (!ziinaConfig?.ziina_api_key) {
      onError('Ziina payment is not configured. Please contact support.');
      return;
    }

    setIsProcessing(true);
    try {
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/order-success`;
      const cancelUrl = `${baseUrl}/order-failed`;
      
      // Create payment intent via Ziina API using their documentation
      const response = await fetch('https://api.ziina.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaConfig.ziina_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 367), // Convert USD to fils (AED * 100)
          currency: 'AED',
          success_url: successUrl,
          cancel_url: cancelUrl,
          customer: {
            phone: phoneNumber,
            email: orderData.email,
            name: `${orderData.firstName} ${orderData.lastName}`
          },
          description: `Order payment for ${orderData.email}`,
          metadata: {
            order_id: `order_${Date.now()}`,
            customer_name: `${orderData.firstName} ${orderData.lastName}`
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Ziina API error: ${response.status} - ${errorData}`);
      }

      const paymentData = await response.json();
      
      if (paymentData.url) {
        // Redirect to Ziina payment page
        window.location.href = paymentData.url;
      } else {
        throw new Error('Invalid payment response from Ziina');
      }
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      onError(error.message || 'Ziina payment failed');
      setIsProcessing(false);
    }
  };

  const aedAmount = amount * 3.67;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center border rounded-xl p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 hover:shadow-lg transition-all duration-500 hover-3d-lift border-purple-200 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 dark:border-purple-800">
        <div className="flex items-center flex-1">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mr-4 flex items-center justify-center text-white font-bold animate-float-gentle shadow-lg">
            <Smartphone className="h-7 w-7" />
          </div>
          <div>
            <span className="text-foreground font-bold text-xl">Pay with Ziina</span>
            <p className="text-sm text-muted-foreground mt-1">Secure digital payment in UAE Dirhams</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AED {aedAmount.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">≈ ${amount.toFixed(2)} USD</div>
        </div>
      </div>
      
      <div className="space-y-4 animate-slide-in-up">
        <div>
          <Label htmlFor="ziina-phone" className="text-base font-semibold">Phone Number *</Label>
          <Input
            id="ziina-phone"
            type="tel"
            placeholder="+971 50 123 4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-2 hover-magnetic form-field h-12 text-lg"
            required
          />
          <p className="text-xs text-muted-foreground mt-2">
            Enter your UAE phone number for Ziina payment
          </p>
        </div>
      </div>
      
      <Button
        onClick={handleZiinaPayment}
        disabled={isProcessing || !phoneNumber || !ziinaConfig?.ziina_api_key}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl btn-premium h-16 text-lg"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-6 w-6 mr-3 animate-spin" />
            Processing Ziina Payment...
          </>
        ) : (
          `Pay AED ${aedAmount.toFixed(2)} with Ziina`
        )}
      </Button>
      
      <div className="text-xs text-center space-y-3 animate-fade-in">
        <div className="flex items-center justify-center gap-3 text-muted-foreground bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
          <span className="font-medium">🔒 Secure payment processing via Ziina Payment Gateway</span>
        </div>
        <div className="text-muted-foreground font-medium">
          Powered by Ziina • Bank-grade security • Instant processing • UAE regulated
        </div>
      </div>
    </div>
  );
};

export default ZiinaPayment;
