
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/components/cart/CartProvider";
import ZiinaPayment from "@/components/payment/ZiinaPayment";
import { CreditCard, MapPin, Package, Gift, Phone, Mail, User, Building } from "lucide-react";

interface CheckoutFormProps {
  items: CartItem[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ items, subtotal, onPaymentSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [shippingAddress, setShippingAddress] = useState({
    first_name: '',
    last_name: '',
    company: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'AE',
    phone: '',
    email: user?.email || ''
  });

  const [billingAddress, setBillingAddress] = useState({ ...shippingAddress });
  const [sameBilling, setSameBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('ziina');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const shipping = 0; // Free shipping
  const tax = subtotal * 0.05; // 5% VAT
  const giftCardDiscount = appliedGiftCard?.amount || 0;
  const total = Math.max(0, subtotal + shipping + tax - giftCardDiscount);

  useEffect(() => {
    if (sameBilling) {
      setBillingAddress(shippingAddress);
    }
  }, [shippingAddress, sameBilling]);

  const applyGiftCard = async () => {
    if (!giftCardCode.trim()) return;

    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', giftCardCode.trim())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Gift Card",
          description: "The gift card code is invalid or has expired.",
          variant: "destructive",
        });
        return;
      }

      if (data.amount <= 0) {
        toast({
          title: "Gift Card Empty",
          description: "This gift card has no remaining balance.",
          variant: "destructive",
        });
        return;
      }

      setAppliedGiftCard(data);
      toast({
        title: "Gift Card Applied!",
        description: `$${data.amount} discount applied to your order.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply gift card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'first_name', 'last_name', 'address_line_1', 
      'city', 'state', 'postal_code', 'phone', 'email'
    ];
    
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        toast({
          title: "Missing Information",
          description: `Please fill in all required shipping fields.`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate customizable products have customization
    for (const item of items) {
      if (item.customization === undefined && item.productId) {
        // Check if product is customizable
        // For now, we'll assume all items can have optional customization
      }
    }

    return true;
  };

  const createOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        user_id: user?.id,
        total_amount: total,
        currency: 'AED',
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        billing_address: sameBilling ? shippingAddress : billingAddress,
        delivery_type: 'standard',
        notes,
        status: 'pending',
        payment_status: 'pending'
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update gift card balance if applied
      if (appliedGiftCard && appliedGiftCard.amount > 0) {
        const usedAmount = Math.min(appliedGiftCard.amount, total);
        const newAmount = appliedGiftCard.amount - usedAmount;
        
        await supabase
          .from('gift_cards')
          .update({ amount: newAmount })
          .eq('id', appliedGiftCard.id);
      }

      onPaymentSuccess(order.id);
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast({
        title: "Order Failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Left Column - Forms */}
      <div className="space-y-6">
        {/* Shipping Address */}
        <Card className="animate-slide-in-left bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <MapPin className="h-5 w-5" />
              Shipping Address *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="text-blue-700 dark:text-blue-300">First Name *</Label>
                <Input
                  id="first_name"
                  value={shippingAddress.first_name}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                  className="border-blue-200 focus:border-blue-400 dark:border-blue-700"
                />
              </div>
              <div>
                <Label htmlFor="last_name" className="text-blue-700 dark:text-blue-300">Last Name *</Label>
                <Input
                  id="last_name"
                  value={shippingAddress.last_name}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                  className="border-blue-200 focus:border-blue-400 dark:border-blue-700"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company" className="text-blue-700 dark:text-blue-300 flex items-center gap-1">
                <Building className="h-4 w-4" />
                Company (Optional)
              </Label>
              <Input
                id="company"
                value={shippingAddress.company}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, company: e.target.value }))}
                className="border-blue-200 focus:border-blue-400 dark:border-blue-700"
              />
            </div>

            <div>
              <Label htmlFor="address_line_1" className="text-blue-700 dark:text-blue-300">Address Line 1 *</Label>
              <Input
                id="address_line_1"
                value={shippingAddress.address_line_1}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line_1: e.target.value }))}
                required
                className="border-blue-200 focus:border-blue-400 dark:border-blue-700"
              />
            </div>

            <div>
              <Label htmlFor="address_line_2" className="text-blue-700 dark:text-blue-300">Address Line 2</Label>
              <Input
                id="address_line_2"
                value={shippingAddress.address_line_2}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line_2: e.target.value }))}
                className="border-blue-200 focus:border-blue-400 dark:border-blue-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-blue-700 dark:text-blue-300">City *</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  required
                  className="border-blue-200 focus:border-blue-400 dark:border-blue-700"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-blue-700 dark:text-blue-300">State/Province *</Label>
                <Input
                  id="state"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                  required
                  className="border-blue-200 focus:border-blue-400 dark:border-blue-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postal_code" className="text-blue-700 dark:text-blue-300">Postal Code *</Label>
                <Input
                  id="postal_code"
                  value={shippingAddress.postal_code}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, postal_code: e.target.value }))}
                  required
                  className="border-blue-200 focus:border-blue-400 dark:border-blue-700"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-blue-700 dark:text-blue-300">Country *</Label>
                <Select value={shippingAddress.country} onValueChange={(value) => setShippingAddress(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger className="border-blue-200 focus:border-blue-400 dark:border-blue-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AE">United Arab Emirates</SelectItem>
                    <SelectItem value="SA">Saudi Arabia</SelectItem>
                    <SelectItem value="KW">Kuwait</SelectItem>
                    <SelectItem value="QA">Qatar</SelectItem>
                    <SelectItem value="BH">Bahrain</SelectItem>
                    <SelectItem value="OM">Oman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  placeholder="+971 50 123 4567"
                  className="border-blue-200 focus:border-blue-400 dark:border-blue-700"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="border-blue-200 focus:border-blue-400 dark:border-blue-700"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Notes */}
        <Card className="animate-slide-in-left bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800" style={{animationDelay: '0.1s'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
              <Package className="h-5 w-5" />
              Order Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions for your order..."
              rows={3}
              className="border-purple-200 focus:border-purple-400 dark:border-purple-700"
            />
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="animate-slide-in-left bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="border-green-200 focus:border-green-400 dark:border-green-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ziina">Ziina Payment</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="cash">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Order Summary */}
      <div className="space-y-6">
        <Card className="animate-slide-in-right bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800 sticky top-4">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-200">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-orange-100 dark:border-orange-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    {item.customization && Object.keys(item.customization).length > 0 && (
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        <Badge variant="outline" className="text-xs">Customized</Badge>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Gift Card */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <Gift className="h-4 w-4" />
                Gift Card
              </Label>
              <div className="flex gap-2">
                <Input
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  placeholder="Enter gift card code"
                  className="border-orange-200 focus:border-orange-400 dark:border-orange-700"
                />
                <Button 
                  onClick={applyGiftCard} 
                  variant="outline"
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300"
                >
                  Apply
                </Button>
              </div>
              {appliedGiftCard && (
                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Gift card applied: -${appliedGiftCard.amount.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-orange-700 dark:text-orange-300">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700 dark:text-orange-300">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700 dark:text-orange-300">VAT (5%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              {appliedGiftCard && (
                <div className="flex justify-between text-green-600">
                  <span>Gift Card</span>
                  <span className="font-semibold">-${giftCardDiscount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold text-orange-800 dark:text-orange-200">
                <span>Total</span>
                <span>${total.toFixed(2)} AED</span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="pt-4">
              {paymentMethod === 'ziina' ? (
                <ZiinaPayment
                  amount={total}
                  onSuccess={() => createOrder()}
                  disabled={loading}
                />
              ) : (
                <Button
                  onClick={createOrder}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    `Complete Order - $${total.toFixed(2)}`
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
