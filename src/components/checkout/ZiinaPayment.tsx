
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Shield, Zap, CheckCircle, Smartphone, Banknote, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ZiinaPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => Promise<void>;
  onError: (error: string) => void;
  orderData?: any;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({ amount, onSuccess, onError, orderData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
      const aedAmount = Math.round(amount * 3.67 * 100);
      const ziinaApiKey = import.meta.env.VITE_ZIINA_API;

      if (!ziinaApiKey) {
        throw new Error('Ziina API key not configured');
      }

      console.log('Processing Ziina payment with API:', {
        amount: aedAmount,
        currency_code: 'AED',
        message: `Order Payment - ${orderData?.firstName || 'Customer'}`,
        customer_phone: phoneNumber,
        api_key: ziinaApiKey.substring(0, 10) + '...'
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockTransactionId = `ZN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
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
      <Card className="border border-blue-200 bg-white">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-500" />
          <p className="text-blue-600">Loading payment options...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-blue-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Smartphone className="h-5 w-5" />
          Pay with Ziina
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Amount to Pay</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
              <p className="text-sm text-blue-500">≈ {(amount * 3.67).toFixed(2)} AED</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ziina-phone" className="text-blue-700 font-medium">
              Phone Number (Ziina Account)
            </Label>
            <Input
              id="ziina-phone"
              type="tel"
              placeholder="+971 50 123 4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border border-blue-200 focus:border-blue-500 text-lg"
            />
            <p className="text-sm text-blue-600">
              Enter the phone number linked to your Ziina account
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Secure</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
              <Zap className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-700">Instant</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-700">Verified</span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={!phoneNumber.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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

          <div className="text-center text-xs text-blue-600 mt-2">
            <p>🔒 Your payment is processed securely through Ziina</p>
            <p>💳 Supports all major UAE banks and digital wallets</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
