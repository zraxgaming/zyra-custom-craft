
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, User, MapPin, CreditCard } from "lucide-react";
import CouponForm from "./CouponForm";
import GiftCardForm from "./GiftCardForm";
import PaymentMethods from "./PaymentMethods";

interface EnhancedCheckoutFormProps {
  items: any[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const EnhancedCheckoutForm: React.FC<EnhancedCheckoutFormProps> = ({ 
  items, 
  subtotal, 
  onPaymentSuccess 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const calculateDiscount = () => {
    let discount = 0;
    
    if (appliedCoupon) {
      if (appliedCoupon.discount_type === 'percentage') {
        discount += subtotal * (appliedCoupon.discount_value / 100);
      } else {
        discount += appliedCoupon.discount_value;
      }
    }
    
    if (appliedGiftCard) {
      discount += Math.min(appliedGiftCard.amount, subtotal - discount);
    }
    
    return Math.max(0, discount);
  };

  const tax = Math.max(0, (subtotal - calculateDiscount()) * 0.08);
  const shipping = 5.00;
  const total = Math.max(0, subtotal + tax + shipping - calculateDiscount());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Left Column - Forms */}
      <div className="lg:col-span-2 space-y-6">
        {/* Contact Information */}
        <Card className="animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
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
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="animate-slide-in-left" style={{animationDelay: '0.1s'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Shipping Address
            </CardTitle>
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
                  className="mt-1"
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
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1"
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
                  className="mt-1"
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
                  className="mt-1"
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
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Coupon Form */}
        <CouponForm
          onCouponApply={setAppliedCoupon}
          onCouponRemove={() => setAppliedCoupon(null)}
          appliedCoupon={appliedCoupon}
          orderTotal={subtotal}
        />

        {/* Gift Card Form */}
        <GiftCardForm
          onGiftCardApply={setAppliedGiftCard}
          onGiftCardRemove={() => setAppliedGiftCard(null)}
          appliedGiftCard={appliedGiftCard}
          orderTotal={subtotal}
        />
      </div>

      {/* Right Column - Order Summary & Payment */}
      <div className="space-y-6">
        {/* Order Summary */}
        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <Separator />
            
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-${appliedCoupon.discount_type === 'percentage' 
                    ? (subtotal * (appliedCoupon.discount_value / 100)).toFixed(2)
                    : appliedCoupon.discount_value.toFixed(2)
                  }</span>
                </div>
              )}
              
              {appliedGiftCard && (
                <div className="flex justify-between text-purple-600">
                  <span>Gift Card</span>
                  <span>-${Math.min(appliedGiftCard.amount, subtotal - (appliedCoupon ? 
                    (appliedCoupon.discount_type === 'percentage' 
                      ? subtotal * (appliedCoupon.discount_value / 100)
                      : appliedCoupon.discount_value) 
                    : 0)).toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <PaymentMethods
          total={total}
          orderData={formData}
          appliedCoupon={appliedCoupon}
          appliedGiftCard={appliedGiftCard}
          onPaymentSuccess={onPaymentSuccess}
        />
      </div>
    </div>
  );
};

export default EnhancedCheckoutForm;
