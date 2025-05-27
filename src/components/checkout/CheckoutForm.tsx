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
  const [showPayPal, setShowPayPal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

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

  const handlePayPalSuccess = async (transactionId: string) => {
    if (!currentOrderId) return;
    // ...order update logic...
    setShowPayPal(false);
    onPaymentSuccess(currentOrderId);
  };

  const handlePayPalError = (error: string) => {
    toast({
      title: "PayPal Payment Failed",
      description: error,
      variant: "destructive"
    });
    setShowPayPal(false);
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
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 py-12 animate-fade-in">
      {/* Left: Details */}
      <div className="space-y-8">
        {/* Contact Info */}
        <Card className="shadow-xl animate-slide-in-left border-0 bg-white/95 dark:bg-gray-900/95">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
            <CardTitle className="flex items-center gap-2 text-2xl text-purple-700 dark:text-purple-300">
              <ShoppingBag className="h-6 w-6 text-pink-500" />
              Contact & Shipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
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
              <div>
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
              <div>
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
              <div>
                <Label htmlFor="address" className="text-base font-semibold">Street Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="form-field mt-2 hover-magnetic"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-base font-semibold">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="form-field mt-2 hover-magnetic"
                  placeholder="Dubai"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-base font-semibold">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="form-field mt-2 hover-magnetic"
                  placeholder="Dubai"
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-base font-semibold">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="form-field mt-2 hover-magnetic"
                  placeholder="00000"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-base font-semibold">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="form-field mt-2 hover-magnetic"
                  placeholder="UAE"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Payment Method */}
        <Card className="shadow-xl animate-slide-in-left border-0 bg-white/95 dark:bg-gray-900/95">
          <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900">
            <CardTitle className="text-2xl text-pink-700 dark:text-pink-300">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <RadioGroup value={formData.paymentMethod} onValueChange={val => setFormData(f => ({ ...f, paymentMethod: val }))}>
              <div className="flex items-center space-x-2 p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50 dark:bg-purple-950 hover:shadow-md transition-all duration-300">
                <RadioGroupItem value="ziina" id="ziina" />
                <Label htmlFor="ziina" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-700 dark:text-purple-300">Ziina Payment (AED)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950 hover:shadow-md transition-all duration-300">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-300">PayPal (USD)</span>
                </Label>
              </div>
            </RadioGroup>
            {formData.paymentMethod === 'paypal' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <PayPalPayment
                  amount={total}
                  orderData={formData}
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                  clientId={PAYPAL_CLIENT_ID}
                />
              </div>
            )}
            {formData.paymentMethod === 'ziina' && (
              <Button onClick={handleContinueToPayment} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-xl">
                Continue to Payment
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Right: Order Summary */}
      <div className="space-y-8">
        <Card className="shadow-xl animate-slide-in-right border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
            <CardTitle className="text-2xl text-purple-700 dark:text-purple-300">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{item.name} x{item.quantity}</span>
                  <span className="font-semibold text-pink-700 dark:text-pink-300">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-2xl font-bold text-purple-700 dark:text-purple-300">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      {showPayPal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 max-w-lg w-full relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
              onClick={() => setShowPayPal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Complete Your PayPal Payment</h2>
            <PayPalPayment
              amount={total}
              orderData={formData}
              onSuccess={handlePayPalSuccess}
              onError={handlePayPalError}
              clientId={PAYPAL_CLIENT_ID}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
