
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard } from 'lucide-react';

export interface PayPalPaymentProps {
  amount: number;
  orderData: any;
  clientId: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ 
  amount, 
  orderData, 
  clientId, 
  onSuccess, 
  onError 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // PayPal integration would go here
      await new Promise(resolve => setTimeout(resolve, 2000));
      const transactionId = `PP${Date.now()}`;
      onSuccess(transactionId);
    } catch (error: any) {
      onError(error.message || 'PayPal payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <CreditCard className="h-5 w-5" />
          PayPal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)} with PayPal`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PayPalPayment;
