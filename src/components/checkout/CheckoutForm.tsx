
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, Truck, Package, MapPin } from "lucide-react";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "UAE"
  });
  const [couponCode, setCouponCode] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);
  const { toast } = useToast();

  const shippingCost = deliveryType === "delivery" ? 30 : 0;
  const discount = appliedCoupon ? (appliedCoupon.discount_type === 'percentage' 
    ? (subtotal * appliedCoupon.discount_value / 100) 
    : appliedCoupon.discount_value) : 0;
  const giftCardDiscount = appliedGiftCard ? Math.min(appliedGiftCard.amount, subtotal + shippingCost - discount) : 0;
  const total = Math.max(0, subtotal + shippingCost - discount - giftCardDiscount);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('active', true)
        .single();

      if (error || !coupon) {
        throw new Error('Invalid coupon code');
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        throw new Error('This coupon has expired');
      }

      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        throw new Error('This coupon has reached its usage limit');
      }

      if (subtotal < coupon.min_purchase) {
        throw new Error(`Minimum purchase of $${coupon.min_purchase} required`);
      }

      setAppliedCoupon(coupon);
      toast({
        title: "Coupon applied",
        description: `${coupon.discount_type === 'percentage' ? coupon.discount_value + '%' : '$' + coupon.discount_value} discount applied`
      });
    } catch (error: any) {
      toast({
        title: "Invalid coupon",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const applyGiftCard = async () => {
    if (!giftCardCode.trim()) return;

    try {
      const { data: giftCard, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', giftCardCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !giftCard) {
        throw new Error('Invalid gift card code');
      }

      if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
        throw new Error('This gift card has expired');
      }

      if (giftCard.amount <= 0) {
        throw new Error('This gift card has no remaining balance');
      }

      setAppliedGiftCard(giftCard);
      toast({
        title: "Gift card applied",
        description: `$${Math.min(giftCard.amount, total).toFixed(2)} applied from your gift card`
      });
    } catch (error: any) {
      toast({
        title: "Invalid gift card",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const processZiinaPayment = async (orderId: string) => {
    try {
      // Simulate Ziina payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await supabase
        .from('orders')
        .update({ 
          status: 'processing',
          payment_status: 'paid'
        })
        .eq('id', orderId);

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Payment failed. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }

    if (deliveryType === "delivery" && (!shippingAddress.firstName || !shippingAddress.address)) {
      toast({
        title: "Address required",
        description: "Please fill in your delivery address",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_amount: total,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'ziina',
          delivery_type: deliveryType,
          shipping_address: deliveryType === "delivery" ? shippingAddress : null,
          billing_address: { ...shippingAddress, phone: phoneNumber }
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization || null
      }));

      await supabase.from('order_items').insert(orderItems);

      // Update coupon usage
      if (appliedCoupon) {
        await supabase
          .from('coupons')
          .update({ used_count: appliedCoupon.used_count + 1 })
          .eq('id', appliedCoupon.id);
      }

      // Update gift card balance
      if (appliedGiftCard) {
        const usedAmount = Math.min(appliedGiftCard.amount, total);
        await supabase
          .from('gift_cards')
          .update({ amount: appliedGiftCard.amount - usedAmount })
          .eq('id', appliedGiftCard.id);
      }

      // Process payment
      const paymentSuccess = await processZiinaPayment(order.id);

      if (paymentSuccess) {
        onPaymentSuccess(order.id);
      }
    } catch (error: any) {
      console.error('Order error:', error);
      toast({
        title: "Order failed",
        description: error.message || "Unable to process order",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Delivery Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Truck className="h-4 w-4" />
                  Delivery - $30 USD / 30 AED
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer flex-1">
                  <MapPin className="h-4 w-4" />
                  Pickup - Free
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {deliveryType === "delivery" && (
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={shippingAddress.firstName}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={shippingAddress.lastName}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+971 50 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button type="button" onClick={applyCoupon} variant="outline">
                Apply
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter gift card code"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value)}
              />
              <Button type="button" onClick={applyGiftCard} variant="outline">
                Apply
              </Button>
            </div>
            {appliedCoupon && (
              <div className="text-sm text-green-600">
                ✓ Coupon applied: {appliedCoupon.code} (-${discount.toFixed(2)})
              </div>
            )}
            {appliedGiftCard && (
              <div className="text-sm text-green-600">
                ✓ Gift card applied: {appliedGiftCard.code} (-${giftCardDiscount.toFixed(2)})
              </div>
            )}
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
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{deliveryType === "delivery" ? "Delivery" : "Pickup"}</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              {appliedGiftCard && (
                <div className="flex justify-between text-green-600">
                  <span>Gift Card</span>
                  <span>-${giftCardDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 border rounded-lg bg-purple-50">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-medium">Ziina Payment</p>
              <p className="text-sm text-gray-600">Secure payment via Ziina</p>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)} with Ziina`}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;
