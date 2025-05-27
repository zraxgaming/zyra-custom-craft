
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface PayPalPaymentProps {
  amount: number;
  orderData: any;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  clientId: string;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  orderData,
  onSuccess,
  onError,
  clientId
}) => {
  const handlePayPalPayment = () => {
    // Simulate PayPal payment for demo purposes
    const transactionId = `PAYPAL_${Date.now()}`;
    onSuccess(transactionId);
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
        <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
          PayPal Payment
        </p>
        <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
          ${amount.toFixed(2)} USD
        </p>
      </div>
      
      <Button 
        onClick={handlePayPalPayment}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        Pay with PayPal
      </Button>
    </div>
  );
};

export default PayPalPayment;
