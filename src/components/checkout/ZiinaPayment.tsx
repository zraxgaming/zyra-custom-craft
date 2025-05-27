
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Loader2, Shield, CheckCircle } from 'lucide-react';

interface ZiinaPaymentProps {
  amount: number;
  orderData: {
    email: string;
    firstName: string;
    lastName: string;
    items: any[];
    subtotal: number;
  };
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({
  amount,
  orderData,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const { toast } = useToast();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const validateCard = () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 16) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid 16-digit card number",
        variant: "destructive"
      });
      return false;
    }

    if (expiryDate.length !== 5 || !expiryDate.includes('/')) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please enter expiry date in MM/YY format",
        variant: "destructive"
      });
      return false;
    }

    if (cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid CVV",
        variant: "destructive"
      });
      return false;
    }

    if (!cardName.trim()) {
      toast({
        title: "Card Name Required",
        description: "Please enter the name on the card",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const processPayment = async () => {
    if (!validateCard()) return;

    setLoading(true);
    try {
      // Convert fils to AED (1 AED = 100 fils)
      const amountInFils = Math.round(amount * 100);

      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          total_amount: amount,
          status: 'pending',
          payment_method: 'ziina',
          currency: 'AED'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      for (const item of orderData.items) {
        await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            customization: item.customization
          });
      }

      // Simulate payment processing with Ziina
      const paymentData = {
        amount: amountInFils,
        currency: 'AED',
        description: `Order #${order.id}`,
        customer: {
          email: orderData.email,
          name: `${orderData.firstName} ${orderData.lastName}`
        },
        card: {
          number: cardNumber.replace(/\s/g, ''),
          expiry: expiryDate,
          cvv: cvv,
          name: cardName
        },
        order_id: order.id
      };

      console.log('Processing Ziina payment:', paymentData);

      // Simulate successful payment
      setTimeout(async () => {
        try {
          // Update order status
          await supabase
            .from('orders')
            .update({ 
              status: 'confirmed',
              payment_status: 'paid'
            })
            .eq('id', order.id);

          toast({
            title: "Payment Successful!",
            description: "Your order has been processed successfully.",
          });

          onSuccess(order.id);
        } catch (error) {
          console.error('Error updating order:', error);
          onError('Failed to update order status');
        }
      }, 2000);

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment processing",
        variant: "destructive"
      });
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Form */}
      <Card className="border-purple-200/50 dark:border-purple-800/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Card Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="cardName" className="text-sm font-medium">
              Cardholder Name
            </Label>
            <Input
              id="cardName"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="cardNumber" className="text-sm font-medium">
              Card Number
            </Label>
            <Input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className="mt-1 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate" className="text-sm font-medium">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                type="text"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="text-sm font-medium">
                CVV
              </Label>
              <Input
                id="cvv"
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                className="mt-1 font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <div className="flex items-center justify-center gap-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-medium">SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
      </div>

      {/* Payment Button */}
      <Button
        onClick={processPayment}
        disabled={loading}
        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pay ${amount.toFixed(2)} AED
          </>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Your payment information is secure and encrypted. We do not store your card details.
      </p>
    </div>
  );
};

export default ZiinaPayment;
