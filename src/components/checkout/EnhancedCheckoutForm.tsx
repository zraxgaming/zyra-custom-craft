import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, CreditCard, ShoppingBag, Loader2 } from "lucide-react";
import CouponForm from "./CouponForm";

interface EnhancedCheckoutFormProps {
  items: any[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const EnhancedCheckoutForm: React.FC<EnhancedCheckoutFormProps> = ({ items, subtotal, onPaymentSuccess }) => {
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
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const couponDiscount = appliedCoupon ? 
    (appliedCoupon.discount_type === 'percentage' ? 
      subtotal * (appliedCoupon.discount_value / 100) : 
      appliedCoupon.discount_value) : 0;
  
  const tax = (subtotal - couponDiscount) * 0.08;
  const shipping = 5.00;
  const total = subtotal - couponDiscount + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCouponApply = (coupon: any) => {
    setAppliedCoupon(coupon);
    toast({
      title: "Coupon Applied!",
      description: `${coupon.discount_value}${coupon.discount_type === 'percentage' ? '%' : '$'} discount applied.`,
    });
  };

  const handleCouponRemove = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon Removed",
      description: "Coupon discount has been removed from your order.",
    });
  };

  const processZiinaPayment = async () => {
    try {
      // Get Ziina configuration from site_config
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['ziina_api_key', 'ziina_merchant_id']);

      if (configError) throw configError;

      const config = configData.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as any);

      if (!config.ziina_api_key || !config.ziina_merchant_id) {
        throw new Error('Ziina payment is not configured. Please contact support.');
      }

      // Create payment with real Ziina API
      const paymentAmount = total * 3.67; // Convert to AED
      const response = await fetch('https://api.ziina.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.ziina_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount,
          currency: 'AED',
          merchant_id: config.ziina_merchant_id,
          success_url: `${window.location.origin}/order-success`,
          cancel_url: `${window.location.origin}/order-failed`,
          customer_email: formData.email,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          description: `Order payment for ${formData.email}`,
          reference: `order_${Date.now()}`,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Ziina payment');
      }

      const data = await response.json();
      
      // Store payment data for verification
      localStorage.setItem('pending_payment', JSON.stringify({
        payment_id: data.id,
        amount: paymentAmount,
        order_data: formData,
        method: 'ziina'
      }));

      // Redirect to Ziina payment page
      window.location.href = data.payment_url;
    } catch (error: any) {
      console.error('Ziina payment error:', error);
      throw error;
    }
  };

  const processPayPalPayment = async () => {
    try {
      const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      
      if (!paypalClientId) {
        throw new Error('PayPal is not configured. Please contact support.');
      }

      // Create PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total.toFixed(2),
          currency: 'USD',
          order_data: formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const data = await response.json();
      
      // Store payment data for verification
      localStorage.setItem('pending_payment', JSON.stringify({
        payment_id: data.id,
        amount: total,
        order_data: formData,
        method: 'paypal'
      }));

      // Redirect to PayPal
      window.location.href = data.approval_url;
    } catch (error: any) {
      console.error('PayPal payment error:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      if (formData.paymentMethod === 'ziina') {
        await processZiinaPayment();
      } else if (formData.paymentMethod === 'paypal') {
        await processPayPalPayment();
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        {/* Contact Information */}
        <Card className="border-border/50 shadow-xl animate-slide-in-left">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
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
                className="mt-2"
                placeholder="your@email.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="border-border/50 shadow-xl animate-slide-in-left" style={{animationDelay: '0.2s'}}>
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
                  className="mt-2"
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
                  className="mt-2"
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
                className="mt-2"
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
                  className="mt-2"
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
                  className="mt-2"
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
                className="mt-2"
                placeholder="10001"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="border-border/50 shadow-xl animate-slide-in-left" style={{animationDelay: '0.4s'}}>
          <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4 p-6 border-2 border-border rounded-xl hover:border-blue-500/50 transition-all duration-500 cursor-pointer animate-scale-in">
                <RadioGroupItem value="ziina" id="ziina" />
                <Label htmlFor="ziina" className="flex items-center gap-4 cursor-pointer flex-1">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Ziina Payment</div>
                    <div className="text-sm text-muted-foreground">Secure digital payment in AED</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-4 p-6 border-2 border-border rounded-xl hover:border-primary/50 transition-all duration-500 cursor-pointer animate-scale-in" style={{animationDelay: '0.2s'}}>
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-4 cursor-pointer flex-1">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
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

      {/* Order Summary */}
      <div className="space-y-6">
        <Card className="border-border/50 shadow-xl sticky top-4 animate-slide-in-right">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {/* Order Items */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-muted/30 animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <Separator />

            {/* Coupon Section */}
            <div className="space-y-4">
              <h4 className="font-semibold">Coupon Code</h4>
              <CouponForm
                onCouponApply={handleCouponApply}
                onCouponRemove={handleCouponRemove}
                appliedCoupon={appliedCoupon}
                orderTotal={total}
              />
            </div>

            <Separator />
            
            {/* Price Breakdown */}
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <p>Subtotal</p>
                <p className="font-semibold">${subtotal.toFixed(2)}</p>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <p>Discount ({appliedCoupon.code})</p>
                  <p className="font-semibold">-${couponDiscount.toFixed(2)}</p>
                </div>
              )}
              <div className="flex justify-between text-lg">
                <p>Shipping</p>
                <p className="font-semibold">${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-lg">
                <p>Tax</p>
                <p className="font-semibold">${tax.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-2xl bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              className="w-full text-xl py-8 hover:scale-105 transition-transform"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${formData.paymentMethod === 'ziina' ? `AED ${(total * 3.67).toFixed(2)}` : `$${total.toFixed(2)}`} with ${formData.paymentMethod === 'ziina' ? 'Ziina' : 'PayPal'}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedCheckoutForm;
