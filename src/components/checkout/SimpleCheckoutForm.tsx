
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, User, MapPin } from "lucide-react";
import ZiinaPayment from "./ZiinaPayment";

interface SimpleCheckoutFormProps {
  items: any[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const SimpleCheckoutForm: React.FC<SimpleCheckoutFormProps> = ({ 
  items, 
  subtotal, 
  onPaymentSuccess 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United Arab Emirates',
    phone: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const { toast } = useToast();

  const tax = subtotal * 0.05; // 5% VAT in UAE
  const shipping = 25.00; // AED 25 shipping
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleContinueToPayment = () => {
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    setIsCreatingOrder(true);
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_amount: total,
          status: 'processing',
          payment_status: 'paid',
          payment_method: 'ziina',
          shipping_address: formData,
          billing_address: formData,
          currency: 'USD'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      onPaymentSuccess(order.id);
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast({
        title: "Order Creation Failed",
        description: "Payment successful but order creation failed. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
    setShowPayment(false);
  };

  if (showPayment) {
    return (
      <div className="max-w-md mx-auto animate-slide-in-up">
        <Button 
          variant="outline" 
          onClick={() => setShowPayment(false)}
          className="mb-6 hover:scale-105 transition-transform duration-200"
          disabled={isCreatingOrder}
        >
          ← Back to Details
        </Button>
        
        <Card className="mb-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-xl animate-scale-in">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center animate-slide-in-left">
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  Subtotal:
                </span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center animate-slide-in-left" style={{animationDelay: '100ms'}}>
                <span>Shipping:</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center animate-slide-in-left" style={{animationDelay: '200ms'}}>
                <span>VAT (5%):</span>
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
        
        <div className="animate-scale-in">
          <ZiinaPayment
            amount={total}
            orderData={formData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl animate-slide-in-left">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
            <CardTitle className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary animate-float" />
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
                className="mt-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                placeholder="your@email.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="animate-slide-in-up" style={{animationDelay: '100ms'}}>
                <Label htmlFor="firstName" className="text-base font-semibold">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="mt-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                  placeholder="John"
                />
              </div>
              <div className="animate-slide-in-up" style={{animationDelay: '200ms'}}>
                <Label htmlFor="lastName" className="text-base font-semibold">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="mt-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="animate-slide-in-up" style={{animationDelay: '300ms'}}>
              <Label htmlFor="phone" className="text-base font-semibold">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="mt-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                placeholder="+971 50 123 4567"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl animate-slide-in-left" style={{animationDelay: '300ms'}}>
          <CardHeader className="bg-gradient-to-r from-secondary/10 via-primary/10 to-secondary/10">
            <CardTitle className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary animate-float" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="animate-slide-in-up">
              <Label htmlFor="address" className="text-base font-semibold">Street Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                placeholder="123 Main Street"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="animate-slide-in-up" style={{animationDelay: '100ms'}}>
                <Label htmlFor="city" className="text-base font-semibold">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="mt-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                  placeholder="Dubai"
                />
              </div>
              <div className="animate-slide-in-up" style={{animationDelay: '200ms'}}>
                <Label htmlFor="state" className="text-base font-semibold">Emirate *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="mt-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                  placeholder="Dubai"
                />
              </div>
            </div>
            
            <div className="animate-slide-in-up" style={{animationDelay: '300ms'}}>
              <Label htmlFor="zipCode" className="text-base font-semibold">Postal Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="mt-2 transition-all duration-300 hover:border-primary/50 focus:border-primary"
                placeholder="00000"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl sticky top-4 animate-slide-in-right">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-muted/30 animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg transition-transform duration-300 hover:scale-110"
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
              <div className="flex justify-between text-lg animate-slide-in-right" style={{animationDelay: '100ms'}}>
                <p>Shipping</p>
                <p className="font-semibold">${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-lg animate-slide-in-right" style={{animationDelay: '200ms'}}>
                <p>VAT (5%)</p>
                <p className="font-semibold">${tax.toFixed(2)}</p>
              </div>
              <Separator className="animate-scale-in" />
              <div className="flex justify-between font-bold text-2xl animate-bounce-in bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>

            <Button 
              onClick={handleContinueToPayment}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 py-6 text-xl font-semibold animate-pulse-gentle"
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

export default SimpleCheckoutForm;
