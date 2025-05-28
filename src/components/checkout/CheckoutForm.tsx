
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Truck, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import ZiinaPayment from "./ZiinaPayment";
import GiftCardForm from "./GiftCardForm";
import CouponForm from "./CouponForm";

interface CheckoutFormProps {
  items: any[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  items,
  subtotal,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "UAE"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentSuccess = (orderId: string) => {
    onPaymentSuccess(orderId);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
  };

  // Calculate totals with discounts
  const couponDiscount = appliedCoupon 
    ? appliedCoupon.discount_type === 'percentage' 
      ? (subtotal * appliedCoupon.discount_value / 100)
      : appliedCoupon.discount_value
    : 0;
  
  const giftCardDiscount = appliedGiftCard 
    ? Math.min(appliedGiftCard.amount, subtotal - couponDiscount)
    : 0;
  
  const finalTotal = Math.max(0, subtotal - couponDiscount - giftCardDiscount);

  const orderData = {
    ...formData,
    items,
    subtotal: finalTotal,
    user_id: user?.id
  };

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <ShoppingBag className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="h-6 w-6 text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-blue-700 dark:text-blue-300">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              {giftCardDiscount > 0 && (
                <div className="flex justify-between text-purple-600">
                  <span>Gift Card</span>
                  <span>-${giftCardDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-blue-700 dark:text-blue-300">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <CouponForm
          onCouponApply={setAppliedCoupon}
          onCouponRemove={() => setAppliedCoupon(null)}
          appliedCoupon={appliedCoupon}
          orderTotal={subtotal}
        />

        <GiftCardForm
          onGiftCardApply={setAppliedGiftCard}
          onGiftCardRemove={() => setAppliedGiftCard(null)}
          appliedGiftCard={appliedGiftCard}
          orderTotal={finalTotal}
        />
      </div>

      {/* Checkout Forms */}
      <div className="space-y-6">
        {/* Shipping Information */}
        <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Truck className="h-5 w-5" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-500"
                  placeholder="+971 50 123 4567"
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-500"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <ZiinaPayment
          amount={finalTotal}
          orderData={orderData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          appliedCoupon={appliedCoupon}
          appliedGiftCard={appliedGiftCard}
        />
      </div>
    </div>
  );
};

export default CheckoutForm;
