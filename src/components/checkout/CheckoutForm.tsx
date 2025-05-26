
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, CreditCard, ShoppingBag } from "lucide-react";
import PaymentProcessor from "./PaymentProcessor";

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
    console.log(`Payment successful:`, {
      transactionId,
      amount: total,
      method: formData.paymentMethod,
      orderData: formData
    });
    
    // Generate order ID and redirect to success page
    const orderId = `order_${Date.now()}`;
    onPaymentSuccess(orderId);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
    setShowPayment(false);
  };

  if (showPayment) {
    return (
      <div className="max-w-md mx-auto animate-fade-in">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowPayment(false)}
            className="mb-4 hover-3d-lift"
          >
            ← Back to Details
          </Button>
          
          <Card className="mb-4 card-premium border-border/50 shadow-xl">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center animate-slide-in-left">
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    Subtotal:
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center animate-slide-in-left" style={{animationDelay: '0.1s'}}>
                  <span>Shipping:</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                  <span>Tax:</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <Separator className="animate-scale-in" />
                <div className="flex justify-between font-bold text-xl animate-bounce-in bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="animate-scale-in">
          <PaymentProcessor
            amount={total}
            currency="USD"
            orderData={formData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            paymentMethod={formData.paymentMethod as 'ziina' | 'paypal'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <Card className="border-border/50 shadow-xl card-premium animate-slide-in-left">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 animate-morphing-gradient">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm animate-float-gentle">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="animate-slide-in-up">
              <Label htmlFor="email" className="text-base font-semibold">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-field mt-2 hover-magnetic"
                placeholder="your@email.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-xl card-premium animate-slide-in-left" style={{animationDelay: '0.2s'}}>
          <CardHeader className="bg-gradient-to-r from-secondary/10 via-primary/10 to-secondary/10">
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="animate-slide-in-up">
                <Label htmlFor="firstName" className="text-base font-semibold">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="form-field mt-2 hover-magnetic"
                  placeholder="John"
                />
              </div>
              <div className="animate-slide-in-up" style={{animationDelay: '0.1s'}}>
                <Label htmlFor="lastName" className="text-base font-semibold">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="form-field mt-2 hover-magnetic"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="animate-slide-in-up" style={{animationDelay: '0.2s'}}>
              <Label htmlFor="address" className="text-base font-semibold">Street Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="form-field mt-2 hover-magnetic"
                placeholder="123 Main Street"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="animate-slide-in-up" style={{animationDelay: '0.3s'}}>
                <Label htmlFor="city" className="text-base font-semibold">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="form-field mt-2 hover-magnetic"
                  placeholder="New York"
                />
              </div>
              <div className="animate-slide-in-up" style={{animationDelay: '0.4s'}}>
                <Label htmlFor="state" className="text-base font-semibold">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="form-field mt-2 hover-magnetic"
                  placeholder="NY"
                />
              </div>
            </div>
            
            <div className="animate-slide-in-up" style={{animationDelay: '0.5s'}}>
              <Label htmlFor="zipCode" className="text-base font-semibold">ZIP Code *</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                className="form-field mt-2 hover-magnetic"
                placeholder="10001"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-xl card-premium animate-slide-in-left" style={{animationDelay: '0.4s'}}>
          <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4 p-6 border-2 border-border rounded-xl hover:border-blue-500/50 transition-all duration-500 cursor-pointer hover-3d-lift hover-neon-glow animate-scale-in">
                <RadioGroupItem value="ziina" id="ziina" />
                <Label htmlFor="ziina" className="flex items-center gap-4 cursor-pointer flex-1">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl animate-float-gentle">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Ziina (Default)</div>
                    <div className="text-sm text-muted-foreground">Secure digital payment in AED</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-4 p-6 border-2 border-border rounded-xl hover:border-primary/50 transition-all duration-500 cursor-pointer hover-3d-lift animate-scale-in" style={{animationDelay: '0.2s'}}>
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-4 cursor-pointer flex-1">
                  <div className="p-3 bg-blue-500/20 rounded-xl animate-particle-float">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">PayPal</div>
                    <div className="text-sm text-muted-foreground">Secure online payment</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-border/50 shadow-xl card-premium sticky top-4 animate-slide-in-right">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 animate-aurora">
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-muted/30 hover-magnetic animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg hover-3d-lift"
                      />
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                        {item.quantity}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <Separator className="animate-scale-in" />
            
            <div className="space-y-4">
              <div className="flex justify-between text-lg animate-slide-in-right">
                <p>Subtotal</p>
                <p className="font-semibold">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-lg animate-slide-in-right" style={{animationDelay: '0.1s'}}>
                <p>Shipping</p>
                <p className="font-semibold">${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-lg animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                <p>Tax</p>
                <p className="font-semibold">${tax.toFixed(2)}</p>
              </div>
              <Separator className="animate-scale-in" />
              <div className="flex justify-between font-bold text-2xl animate-bounce-in bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-text-shimmer">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>

            <Button 
              onClick={handleContinueToPayment}
              className="w-full btn-premium text-xl py-8 animate-elastic-scale hover-ripple"
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
