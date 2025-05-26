
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, CreditCard, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AddressForm from "./AddressForm";
import CouponForm from "./CouponForm";
import GiftCardForm from "./GiftCardForm";
import PaymentMethods from "./PaymentMethods";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface EnhancedCheckoutFormProps {
  items: CartItem[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const EnhancedCheckoutForm: React.FC<EnhancedCheckoutFormProps> = ({
  items,
  subtotal,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);

  const handleShippingInfoChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.discount_type === 'percentage') {
      return subtotal * (appliedCoupon.discount_value / 100);
    }
    return appliedCoupon.discount_value;
  };

  const calculateGiftCardDiscount = () => {
    if (!appliedGiftCard) return 0;
    return Math.min(appliedGiftCard.amount, subtotal - calculateDiscount());
  };

  const tax = subtotal * 0.08;
  const shipping = 5.00;
  const discount = calculateDiscount();
  const giftCardDiscount = calculateGiftCardDiscount();
  const total = Math.max(0, subtotal + tax + shipping - discount - giftCardDiscount);

  const orderData = {
    ...shippingInfo,
    user_id: user?.id,
    items,
    subtotal,
    tax,
    shipping,
    discount,
    giftCardDiscount,
    total,
    appliedCoupon,
    appliedGiftCard
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Forms */}
      <div className="lg:col-span-2 space-y-6">
        {/* Shipping Information */}
        <Card className="animate-slide-in-left">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 animate-shimmer">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary animate-bounce" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AddressForm 
              shippingInfo={shippingInfo}
              onShippingInfoChange={handleShippingInfoChange}
            />
          </CardContent>
        </Card>

        {/* Coupons and Gift Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            orderTotal={total}
          />
        </div>

        {/* Payment Methods */}
        <PaymentMethods
          total={total}
          onPaymentSuccess={onPaymentSuccess}
          orderData={orderData}
          appliedCoupon={appliedCoupon}
          appliedGiftCard={appliedGiftCard}
        />
      </div>

      {/* Right Column - Order Summary */}
      <div className="space-y-6">
        <Card className="sticky top-6 animate-slide-in-right">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/30 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Gift className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Calculations */}
            <div className="space-y-2">
              <div className="flex justify-between animate-slide-in-right">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600 animate-slide-in-right">
                  <span>Coupon Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              {giftCardDiscount > 0 && (
                <div className="flex justify-between text-purple-600 animate-slide-in-right">
                  <span>Gift Card:</span>
                  <span>-${giftCardDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between animate-slide-in-right">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between animate-slide-in-right">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg animate-bounce-in">
                <span>Total:</span>
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {total === 0 && (
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
                <p className="text-green-700 font-medium">🎉 Your order is completely covered!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedCheckoutForm;
