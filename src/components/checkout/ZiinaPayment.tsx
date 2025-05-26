
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Loader2 } from "lucide-react";

interface ZiinaPaymentProps {
  amount: number;
  orderData: any;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const ZiinaPayment: React.FC<ZiinaPaymentProps> = ({ amount, orderData, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const handleZiinaPayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number for Ziina payment",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Initialize Ziina payment with real integration
      const ziinaScript = document.createElement('script');
      ziinaScript.src = 'https://js.ziina.com/v1/ziina.js';
      document.head.appendChild(ziinaScript);

      ziinaScript.onload = () => {
        // @ts-ignore
        const ziina = new Ziina({
          publicKey: 'pk_test_example', // This would come from site_config
          mode: 'test' // or 'live' for production
        });

        const paymentData = {
          amount: amount * 3.67, // Convert USD to AED
          currency: 'AED',
          customer: {
            phone: phoneNumber,
            email: orderData.email,
            name: `${orderData.firstName} ${orderData.lastName}`
          },
          description: `Order payment for ${orderData.email}`,
          metadata: {
            order_id: `order_${Date.now()}`,
            customer_name: `${orderData.firstName} ${orderData.lastName}`
          }
        };

        ziina.createPayment(paymentData)
          .then((result: any) => {
            if (result.success) {
              toast({
                title: "Payment Successful",
                description: "Your Ziina payment has been processed successfully",
              });
              onSuccess(result.transaction_id);
            } else {
              throw new Error(result.error || 'Payment failed');
            }
          })
          .catch((error: any) => {
            console.error('Ziina payment error:', error);
            onError(error.message || 'Ziina payment failed');
          })
          .finally(() => {
            setIsProcessing(false);
            document.head.removeChild(ziinaScript);
          });
      };

      ziinaScript.onerror = () => {
        setIsProcessing(false);
        onError('Failed to load Ziina payment system');
      };
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      onError(error.message || 'Ziina payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center border rounded-md p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-md transition-all duration-300 hover-3d-lift">
        <div className="flex items-center flex-1">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4 flex items-center justify-center text-white font-bold animate-float-gentle">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <span className="text-foreground font-semibold text-lg">Pay with Ziina</span>
            <p className="text-sm text-muted-foreground">Secure digital payment in AED</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AED {(amount * 3.67).toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">≈ ${amount.toFixed(2)} USD</div>
        </div>
      </div>
      
      <div className="space-y-4 animate-slide-in-up">
        <div>
          <Label htmlFor="ziina-phone" className="text-base font-semibold">Phone Number *</Label>
          <Input
            id="ziina-phone"
            type="tel"
            placeholder="+971 50 123 4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-2 hover-magnetic form-field"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter your UAE phone number for Ziina payment
          </p>
        </div>
      </div>
      
      <Button
        onClick={handleZiinaPayment}
        disabled={isProcessing || !phoneNumber}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg btn-premium"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing Ziina Payment...
          </>
        ) : (
          `Pay AED ${(amount * 3.67).toFixed(2)} with Ziina`
        )}
      </Button>
      
      <div className="text-xs text-center space-y-2 animate-fade-in">
        <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>🔒 Secure payment processing via Ziina Payment Gateway</span>
        </div>
        <div className="text-muted-foreground">
          Powered by Ziina • Bank-grade security • Instant processing
        </div>
      </div>
    </div>
  );
};

export default ZiinaPayment;
