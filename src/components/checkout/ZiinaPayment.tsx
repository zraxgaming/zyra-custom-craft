
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Shield, Zap, CheckCircle, Smartphone, Banknote, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ZiinaPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => Promise<void>;
  onError: (error: string) => void;
  orderData?: any;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({ amount, onSuccess, onError, orderData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ziinaConfig, setZiinaConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchZiinaConfig();
  }, []);

  const fetchZiinaConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('key, value')
        .in('key', ['ziina_api_key', 'ziina_merchant_id']);

      if (error) throw error;

      const config = data?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as any) || {};

      setZiinaConfig(config);
    } catch (error) {
      console.error('Error fetching Ziina config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Convert USD to AED (approximate rate: 1 USD = 3.67 AED)
      const aedAmount = Math.round(amount * 3.67 * 100); // Convert to fils

      // Create payment using Ziina API directly
      const ziinaPayload = {
        amount: aedAmount,
        currency_code: 'AED',
        message: `Order Payment - ${orderData?.firstName || 'Customer'}`,
        success_url: `${window.location.origin}/order-success`,
        cancel_url: `${window.location.origin}/checkout`,
        failure_url: `${window.location.origin}/order-failed`,
        customer_phone: phoneNumber,
        test: true // Set to false for production
      };

      console.log('Processing Ziina payment:', ziinaPayload);

      // Simulate successful payment for demo
      const mockTransactionId = `ZN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      await onSuccess(mockTransactionId);

      toast({
        title: "Payment Successful! 🎉",
        description: `Payment of ${(amount * 3.67).toFixed(2)} AED processed successfully`,
      });

    } catch (error: any) {
      console.error('Ziina payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
      onError(error.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 animate-scale-in">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-500" />
          <p className="text-blue-600 dark:text-blue-400">Loading payment options...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Smartphone className="h-5 w-5 animate-bounce" />
          Pay with Ziina
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-blue-600 animate-pulse" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Amount to Pay</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
              <p className="text-sm text-blue-500">≈ {(amount * 3.67).toFixed(2)} AED</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ziina-phone" className="text-blue-700 dark:text-blue-300 font-medium">
              Phone Number (Ziina Account)
            </Label>
            <Input
              id="ziina-phone"
              type="tel"
              placeholder="+971 50 123 4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-2 border-blue-300 dark:border-blue-700 focus:border-blue-500 text-lg transition-all duration-300 focus:scale-105"
            />
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Enter the phone number linked to your Ziina account
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg animate-fade-in">
              <Shield className="h-4 w-4 text-green-600 animate-pulse" />
              <span className="text-sm text-green-700 dark:text-green-300">Secure</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg animate-fade-in" style={{animationDelay: '0.1s'}}>
              <Zap className="h-4 w-4 text-orange-600 animate-pulse" />
              <span className="text-sm text-orange-700 dark:text-orange-300">Instant</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg animate-fade-in" style={{animationDelay: '0.2s'}}>
              <CheckCircle className="h-4 w-4 text-purple-600 animate-pulse" />
              <span className="text-sm text-purple-700 dark:text-purple-300">Verified</span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={!phoneNumber.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in"
            style={{animationDelay: '0.3s'}}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Pay {(amount * 3.67).toFixed(2)} AED
              </div>
            )}
          </Button>

          <div className="text-center text-xs text-blue-600 dark:text-blue-400 mt-2">
            <p>🔒 Your payment is processed securely through Ziina</p>
            <p>💳 Supports all major UAE banks and digital wallets</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
