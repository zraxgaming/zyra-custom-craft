
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (value: string) => void;
  onPayPalApprove: (data: any) => Promise<void>;
  isProcessing: boolean;
  total: number;
  onCompleteOrder: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodChange,
  onPayPalApprove,
  isProcessing,
  total,
  onCompleteOrder
}) => {
  return (
    <div>
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={onMethodChange}
        className="space-y-3"
      >
        <div className="flex items-start space-x-2 border rounded-md p-3">
          <RadioGroupItem value="credit_card" id="credit-card" />
          <Label htmlFor="credit-card" className="font-normal cursor-pointer w-full">
            <div className="font-medium">Credit/Debit Card</div>
            <div className="flex items-center space-x-2 mt-2">
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8" />
              <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" className="h-8" />
            </div>
            
            {selectedMethod === "credit_card" && (
              <div className="mt-4 grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="1234 5678 9012 3456" 
                    required={selectedMethod === "credit_card"}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiration Date</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY" 
                      required={selectedMethod === "credit_card"}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123" 
                      required={selectedMethod === "credit_card"}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input 
                    id="nameOnCard" 
                    placeholder="John Doe" 
                    required={selectedMethod === "credit_card"}
                  />
                </div>
              </div>
            )}
          </Label>
        </div>
        
        <div className="flex items-start space-x-2 border rounded-md p-3">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal" className="font-normal cursor-pointer w-full">
            <div className="font-medium">PayPal</div>
            <div className="flex items-center mt-2">
              <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-8" />
            </div>
            <div className="text-sm text-gray-500 mt-1">
              You will be redirected to PayPal to complete your purchase.
            </div>
            
            {selectedMethod === "paypal" && (
              <div className="mt-4">
                <PayPalScriptProvider options={{ 
                  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
                  currency: "USD" 
                }}>
                  <PayPalButtons
                    style={{ layout: "horizontal" }}
                    createOrder={(_data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: total.toFixed(2),
                              currency_code: "USD"
                            },
                            description: `Order from Zyra Store`
                          }
                        ]
                      });
                    }}
                    onApprove={onPayPalApprove}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </Label>
        </div>
      </RadioGroup>
      
      {selectedMethod === "credit_card" && (
        <Button 
          className="w-full mt-6" 
          size="lg" 
          type="submit"
          disabled={isProcessing}
          onClick={onCompleteOrder}
        >
          {isProcessing ? "Processing..." : `Complete Order • $${total.toFixed(2)}`}
        </Button>
      )}
    </div>
  );
};

export default PaymentMethods;
