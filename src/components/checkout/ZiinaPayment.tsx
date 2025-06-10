
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Shield, Zap, CheckCircle, AlertCircle, Smartphone, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ZiinaPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => Promise<void>;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({ amount, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentStep, setPaymentStep] = useState<'input' | 'processing' | 'confirm'>('input');
  const [ziinaConfig, setZiinaConfig] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchZiinaConfig();
  }, []);

  const fetchZiinaConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('key, value')
        .in('key', ['ziina_api_key', 'ziina_merchant_id', 'ziina_enabled']);

      if (error) throw error;

      const config = data?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as any) || {};

      setZiinaConfig(config);
    } catch (error) {
      console.error('Error fetching Ziina config:', error);
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

    if (!ziinaConfig?.ziina_enabled) {
      toast({
        title: "Payment Method Unavailable",
        description: "Ziina payments are currently disabled",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Simulate Ziina payment API call
      const paymentData = {
        amount: amount,
        phone: phoneNumber,
        merchant_id: ziinaConfig.ziina_merchant_id,
        api_key: ziinaConfig.ziina_api_key
      };

      // In a real implementation, this would call the Ziina API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate a mock transaction ID
      const mockTransactionId = `ZN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(mockTransactionId);
      setPaymentStep('confirm');

      toast({
        title: "Payment Request Sent! 📱",
        description: "Please check your Ziina app to complete the payment",
      });
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process Ziina payment",
        variant: "destructive"
      });
      onError(error.message || "Payment failed");
      setPaymentStep('input');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPayment = async () => {
    try {
      await onSuccess(transactionId);
      toast({
        title: "Payment Successful! 🎉",
        description: "Your payment has been processed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Confirmation Failed",
        description: error.message || "Failed to confirm payment",
        variant: "destructive"
      });
      onError(error.message || "Payment confirmation failed");
    }
  };

  const resetPayment = () => {
    setPaymentStep('input');
    setPhoneNumber('');
    setTransactionId('');
  };

  if (!ziinaConfig?.ziina_enabled) {
    return (
      <Card className="border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 animate-scale-in">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Ziina payments are currently unavailable</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Smartphone className="h-5 w-5 animate-bounce" />
          Ziina Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentStep === 'input' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-semibold text-blue-700 dark:text-blue-300">Amount to Pay</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
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
                className="border-2 border-blue-300 dark:border-blue-700 focus:border-blue-500 text-lg"
              />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Enter the phone number linked to your Ziina account
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <Shield className="h-4 w-4 text-green-600 animate-pulse" />
                <span className="text-sm text-green-700 dark:text-green-300">Secure</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <Zap className="h-4 w-4 text-orange-600 animate-pulse" />
                <span className="text-sm text-orange-700 dark:text-orange-300">Instant</span>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={!phoneNumber.trim() || isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Sending Request...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Pay with Ziina
                </div>
              )}
            </Button>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-8 animate-bounce-in">
            <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">
              Payment Request Sent
            </h3>
            <p className="text-blue-600 dark:text-blue-400 mb-4">
              Check your Ziina app to complete the payment
            </p>
            <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 animate-pulse">
              Waiting for confirmation...
            </Badge>
          </div>
        )}

        {paymentStep === 'confirm' && (
          <div className="space-y-4 animate-scale-in">
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
                Payment Received!
              </h3>
              <p className="text-green-600 dark:text-green-400 mb-4">
                Transaction ID: {transactionId}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmPayment}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                Confirm Payment
              </Button>
              <Button
                onClick={resetPayment}
                variant="outline"
                className="px-6 hover:scale-105 transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
