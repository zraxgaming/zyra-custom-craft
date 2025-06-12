
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Shield, Zap, CheckCircle, Smartphone, Banknote, Loader2, Clock, Store } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState('ziina');
  const [shippingMethod, setShippingMethod] = useState('store_pickup');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handlePayment = async () => {
    if (paymentMethod === 'ziina' && !phoneNumber.trim()) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number for Ziina payment",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'cash_on_pickup') {
        // Cash on Store Pickup - no payment processing needed
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockTransactionId = `CASH_PICKUP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await onSuccess(mockTransactionId);

        toast({
          title: "Order Confirmed! 📦",
          description: `Your order is ready for pickup. Total: $${amount.toFixed(2)}`,
        });
        return;
      }

      // Ziina Payment Processing
      const aedAmount = Math.round(amount * 3.67 * 100);
      const ziinaApiKey = import.meta.env.VITE_ZIINA_API;

      if (!ziinaApiKey) {
        console.warn('Ziina API key not configured, using demo mode');
        // Demo mode - simulate successful payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockTransactionId = `ZN_DEMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await onSuccess(mockTransactionId);

        toast({
          title: "Payment Successful! 🎉",
          description: `Demo payment of ${(amount * 3.67).toFixed(2)} AED processed successfully`,
        });
        return;
      }

      console.log('Processing Ziina payment:', {
        amount: aedAmount,
        currency_code: 'AED',
        message: `Order Payment - ${orderData?.firstName || 'Customer'}`,
        customer_phone: phoneNumber,
        api_key: ziinaApiKey.substring(0, 10) + '...'
      });

      // Real Ziina API call
      const response = await fetch('https://api.ziina.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ziinaApiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: aedAmount,
          currency_code: 'AED',
          message: `Order Payment - ${orderData?.firstName || 'Customer'}`,
          customer_phone: phoneNumber,
          redirect_url: `${window.location.origin}/order-success`,
          webhook_url: `${window.location.origin}/api/ziina-webhook`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Payment failed with status ${response.status}`);
      }

      const data = await response.json();
      const transactionId = data.id || data.transaction_id || `ZN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await onSuccess(transactionId);

      toast({
        title: "Payment Successful! 🎉",
        description: `Payment of ${(amount * 3.67).toFixed(2)} AED processed successfully`,
      });

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive"
      });
      onError(error.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card className="border border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-500" />
          <p className="text-blue-600 font-medium">Loading payment options...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <CreditCard className="h-5 w-5" />
          Payment & Delivery
          <div className="flex items-center gap-1 ml-auto">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Available 24/7</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-3">
          <Label className="text-blue-700 font-medium">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="border border-blue-200 focus:border-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ziina">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Ziina Digital Payment
                </div>
              </SelectItem>
              <SelectItem value="cash_on_pickup">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Cash on Store Pickup
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shipping Method */}
        <div className="space-y-3">
          <Label className="text-blue-700 font-medium">Delivery Method</Label>
          <Select value={shippingMethod} onValueChange={setShippingMethod}>
            <SelectTrigger className="border border-blue-200 focus:border-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="store_pickup">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Store Pickup (Free)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-700">Amount to Pay</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-600">${amount.toFixed(2)}</span>
            {paymentMethod === 'ziina' && (
              <p className="text-sm text-blue-500">≈ {(amount * 3.67).toFixed(2)} AED</p>
            )}
          </div>
        </div>

        {paymentMethod === 'ziina' && (
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
              className="border border-blue-200 focus:border-blue-500 text-lg transition-colors"
            />
            <p className="text-sm text-blue-600">
              Enter the phone number linked to your Ziina account
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg transition-colors hover:bg-green-100">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Secure</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg transition-colors hover:bg-orange-100">
            <Zap className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700 font-medium">
              {paymentMethod === 'ziina' ? 'Instant' : 'Quick'}
            </span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg transition-colors hover:bg-purple-100">
            <CheckCircle className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-purple-700 font-medium">
              {paymentMethod === 'ziina' ? '24/7' : 'Flexible'}
            </span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={(paymentMethod === 'ziina' && !phoneNumber.trim()) || isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {paymentMethod === 'ziina' ? (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay {(amount * 3.67).toFixed(2)} AED with Ziina
                </>
              ) : (
                <>
                  <Store className="h-4 w-4" />
                  Confirm Order - Pay ${amount.toFixed(2)} on Pickup
                </>
              )}
            </div>
          )}
        </Button>

        <div className="text-center text-xs text-blue-600 mt-2 space-y-1">
          {paymentMethod === 'ziina' ? (
            <>
              <p className="flex items-center justify-center gap-1">
                🔒 <span>Secure payment processed through Ziina</span>
              </p>
              <p className="flex items-center justify-center gap-1">
                💳 <span>Available 24/7 - Supports all major UAE banks</span>
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center justify-center gap-1">
                🏪 <span>Pay with cash when you pick up your order</span>
              </p>
              <p className="flex items-center justify-center gap-1">
                📍 <span>Store pickup available during business hours</span>
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
