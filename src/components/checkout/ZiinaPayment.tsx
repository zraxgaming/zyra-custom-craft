
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Smartphone, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface ZiinaPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({ amount, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate success
      const transactionId = `ZN${Date.now()}`;
      
      toast({
        title: "Payment Successful!",
        description: `Transaction ID: ${transactionId}`,
      });
      
      onSuccess(transactionId);
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      onError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 animate-scale-in">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-purple-700 dark:text-purple-300">
          <Smartphone className="h-6 w-6" />
          Ziina Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            ${amount.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            Pay securely with Ziina (UAE)
          </p>
        </div>
        
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay with Ziina
            </>
          )}
        </Button>
        
        <div className="text-xs text-center text-muted-foreground">
          Secure payment powered by Ziina
        </div>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
