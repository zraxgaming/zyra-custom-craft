
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, CreditCard } from "lucide-react";
import ZiinaPayment from "./ZiinaPayment";
import PayPalPayment from "./PayPalPayment";

interface CheckoutFormProps {
  items: any[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ items, subtotal, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'ziina'
  });
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  const tax = subtotal * 0.08;
  const shipping = 5.00;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleContinueToPayment = () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log(`Payment successful with ${formData.paymentMethod}:`, {
      transactionId,
      amount: total,
      method: formData.paymentMethod
    });
    
    // Generate order ID and redirect to success page
    const orderId = `order_${Date.now()}`;
    onPaymentSuccess(orderId);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
  };

  if (showPayment) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Complete Payment</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setShowPayment(false)}
              className="w-fit"
            >
              ← Back to Details
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            {formData.paymentMethod === 'ziina' ? (
              <ZiinaPayment
                amount={total}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <PayPalPayment
                amount={total}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-blue-500/50 transition-all duration-300 cursor-pointer">
                <RadioGroupItem value="ziina" id="ziina" />
                <Label htmlFor="ziina" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Ziina (Default)</div>
                    <div className="text-sm text-muted-foreground">Secure digital payment in AED</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">PayPal</div>
                    <div className="text-sm text-muted-foreground">Secure online payment</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>

            <Button 
              onClick={handleContinueToPayment}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              size="lg"
            >
              Continue to Payment - ${total.toFixed(2)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
