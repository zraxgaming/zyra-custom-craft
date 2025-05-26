
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Smartphone } from "lucide-react";

interface PaymentMethodsProps {
  total: number;
  onPaymentMethodSelect: (method: string) => void;
  onPaymentComplete: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  total,
  onPaymentMethodSelect,
  onPaymentComplete
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("ziina");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!selectedMethod) {
      console.log('Payment method required');
      toast({
        title: "Payment method required",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`Payment successful with ${selectedMethod}:`, total);
      toast({
        title: "Payment successful!",
        description: `Payment of $${total.toFixed(2)} processed successfully`,
      });
      
      onPaymentComplete();
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive"
      });
    } finally {
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
          onValueChange={(value) => {
            setSelectedMethod(value);
            onPaymentMethodSelect(value);
          }}
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
                  <Wallet className="h-5 w-5 text-blue-600" />
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
              ${total.toFixed(2)}
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
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Payment...
              </div>
            ) : (
              `Complete Order - $${total.toFixed(2)}`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
