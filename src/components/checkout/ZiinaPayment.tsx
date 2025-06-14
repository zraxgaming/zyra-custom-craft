
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Loader2 } from "lucide-react";

interface ZiinaPaymentProps {
  amount: number; // Total amount in AED
  onInitiatePayment: () => Promise<void>; // Callback to start the payment process
  isProcessing: boolean; // Loading state from parent
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({
  amount,
  onInitiatePayment,
  isProcessing
}) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <Smartphone className="h-6 w-6" />
            <span className="font-semibold text-lg">Ziina Payment</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300">
            Pay securely with Ziina - UAE's leading digital wallet. You will be redirected.
          </p>
          
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            AED {amount.toFixed(2)}
          </div>
          
          <Button
            onClick={onInitiatePayment}
            disabled={isProcessing || amount <= 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 mr-2" />
                Pay with Ziina
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure payment powered by Ziina
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZiinaPayment;
