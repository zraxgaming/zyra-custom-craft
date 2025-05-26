
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, Smartphone, Loader2, CreditCard } from "lucide-react";

interface PaymentMethodsProps {
  total: number;
  orderData: any;
  appliedCoupon?: any;
  appliedGiftCard?: any;
  onPaymentSuccess: (orderId: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  total,
  orderData,
  appliedCoupon,
  appliedGiftCard,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("ziina");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const processZiinaPayment = async () => {
    try {
      // Get Ziina configuration from site_config
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['ziina_api_key', 'ziina_merchant_id', 'ziina_base_url']);

      if (configError) throw new Error('Failed to fetch Ziina configuration');

      const config = configData.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as any);

      const ziinaApiKey = config.ziina_api_key;
      const ziinaMerchantId = config.ziina_merchant_id;
      const ziinaBaseUrl = config.ziina_base_url || 'https://api-v2.ziina.com';

      if (!ziinaApiKey || !ziinaMerchantId) {
        throw new Error('Ziina API credentials not configured in admin settings');
      }

      const paymentAmount = Math.round(total * 3.67); // Convert to AED

      const paymentPayload = {
        amount: paymentAmount,
        currency_code: 'AED',
        message: `Order payment for ${orderData.email}`,
        success_url: `${window.location.origin}/order-success`,
        cancel_url: `${window.location.origin}/order-failed`,
        failure_url: `${window.location.origin}/order-failed`,
        test: true,
        transaction_source: 'directApi',
        expiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        allow_tips: true
      };

      const response = await fetch(`${ziinaBaseUrl}/api/payment_intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ziina API error: ${response.status}`);
      }

      const ziinaData = await response.json();

      if (!ziinaData?.payment_url) {
        throw new Error('No payment URL received from Ziina');
      }

      // Store payment data for verification
      localStorage.setItem('pending_payment', JSON.stringify({
        payment_id: ziinaData.id,
        amount: paymentAmount,
        order_data: orderData,
        method: 'ziina',
        applied_coupon: appliedCoupon,
        applied_gift_card: appliedGiftCard
      }));

      // Redirect to Ziina payment page
      window.location.href = ziinaData.payment_url;
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      throw error;
    }
  };

  const processPayPalPayment = async () => {
    try {
      // Get PayPal client ID from environment
      const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      
      if (!paypalClientId) {
        throw new Error('PayPal client ID not configured in environment variables');
      }

      // Create PayPal order using their SDK
      const paypalPayload = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2)
          },
          description: `Order payment for ${orderData.email}`
        }],
        application_context: {
          return_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/order-failed`,
          brand_name: 'Zyra Store',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW'
        }
      };

      // Get PayPal access token
      const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Authorization': `Basic ${btoa(`${paypalClientId}:${import.meta.env.PAYPAL_CLIENT_SECRET || ''}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (!authResponse.ok) {
        throw new Error('Failed to authenticate with PayPal');
      }

      const authData = await authResponse.json();

      // Create PayPal order
      const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.access_token}`,
        },
        body: JSON.stringify(paypalPayload)
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const orderData = await orderResponse.json();
      const approvalUrl = orderData.links.find((link: any) => link.rel === 'approve')?.href;

      if (!approvalUrl) {
        throw new Error('No approval URL received from PayPal');
      }

      // Store payment data for verification
      localStorage.setItem('pending_payment', JSON.stringify({
        payment_id: orderData.id,
        amount: total,
        order_data: orderData,
        method: 'paypal',
        applied_coupon: appliedCoupon,
        applied_gift_card: appliedGiftCard
      }));

      // Redirect to PayPal
      window.location.href = approvalUrl;
    } catch (error: any) {
      console.error('PayPal payment error:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (selectedMethod === 'ziina') {
        await processZiinaPayment();
      } else if (selectedMethod === 'paypal') {
        await processPayPalPayment();
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full animate-fade-in bg-gradient-to-br from-card/80 to-card border-border/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wallet className="h-6 w-6 text-primary" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <RadioGroup
          value={selectedMethod}
          onValueChange={setSelectedMethod}
          className="space-y-4"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-blue-500/50 transition-all duration-300 cursor-pointer">
              <RadioGroupItem value="ziina" id="ziina" className="text-blue-600" />
              <Label htmlFor="ziina" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-lg">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Ziina</div>
                  <div className="text-sm text-muted-foreground">Secure digital payment in AED</div>
                </div>
              </Label>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
              <RadioGroupItem value="paypal" id="paypal" className="text-primary" />
              <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">PayPal</div>
                  <div className="text-sm text-muted-foreground">Secure online payment</div>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>

        <div className="pt-6 border-t border-border/50">
          <div className="flex items-center justify-between mb-6 p-4 bg-muted/30 rounded-lg">
            <span className="text-lg font-semibold text-foreground">Total Amount:</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {selectedMethod === 'ziina' ? `AED ${(total * 3.67).toFixed(2)}` : `$${total.toFixed(2)}`}
            </span>
          </div>
          
          <Button
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg text-white font-semibold py-3 text-lg"
            size="lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </div>
            ) : (
              `Pay with ${selectedMethod === 'ziina' ? 'Ziina' : 'PayPal'}`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
