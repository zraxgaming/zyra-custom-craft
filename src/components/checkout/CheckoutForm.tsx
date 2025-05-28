
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Package, MapPin, User, Gift, Percent } from 'lucide-react';

interface CheckoutFormProps {
  items: any[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ items, subtotal, onPaymentSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [giftCardDiscount, setGiftCardDiscount] = useState(0);
  const [deliveryType, setDeliveryType] = useState('delivery');
  
  const shippingCost = deliveryType === 'pickup' ? 0 : 30;
  const total = subtotal + shippingCost - discount - giftCardDiscount;

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UAE',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !coupon) {
        toast({
          title: "Invalid Coupon",
          description: "Coupon code not found or expired",
          variant: "destructive",
        });
        return;
      }

      const now = new Date();
      if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        toast({
          title: "Expired Coupon",
          description: "This coupon has expired",
          variant: "destructive",
        });
        return;
      }

      if (subtotal < coupon.min_purchase) {
        toast({
          title: "Minimum Purchase Required",
          description: `Minimum purchase of $${coupon.min_purchase} required`,
          variant: "destructive",
        });
        return;
      }

      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = (subtotal * coupon.discount_value) / 100;
      } else {
        discountAmount = coupon.discount_value;
      }

      setDiscount(discountAmount);
      toast({
        title: "Coupon Applied",
        description: `Discount of $${discountAmount.toFixed(2)} applied`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply coupon",
        variant: "destructive",
      });
    }
  };

  const applyGiftCard = async () => {
    if (!giftCardCode.trim()) return;

    try {
      const { data: giftCard, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', giftCardCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !giftCard) {
        toast({
          title: "Invalid Gift Card",
          description: "Gift card not found or inactive",
          variant: "destructive",
        });
        return;
      }

      if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
        toast({
          title: "Expired Gift Card",
          description: "This gift card has expired",
          variant: "destructive",
        });
        return;
      }

      const giftCardAmount = Math.min(giftCard.amount, total);
      setGiftCardDiscount(giftCardAmount);
      toast({
        title: "Gift Card Applied",
        description: `$${giftCardAmount.toFixed(2)} applied from gift card`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply gift card",
        variant: "destructive",
      });
    }
  };

  const handleZiinaPayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue",
        variant: "destructive",
      });
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (deliveryType === 'delivery' && (!formData.address || !formData.city)) {
      toast({
        title: "Missing Address",
        description: "Please provide delivery address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'ziina',
          currency: 'USD',
          delivery_type: deliveryType,
          shipping_address: deliveryType === 'delivery' ? {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          } : null,
          billing_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
          },
          notes: formData.notes
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      if (items.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(
            items.map(item => ({
              order_id: order.id,
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
              customization: item.customization
            }))
          );

        if (itemsError) throw itemsError;
      }

      // Get Ziina configuration
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['ziina_api_key', 'ziina_merchant_id']);

      if (configError) throw configError;

      const config = configData.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as any);

      // Convert to AED and fils for Ziina
      const aedAmount = total * 3.67; // USD to AED conversion
      const filsAmount = Math.round(aedAmount * 100); // AED to fils

      const ziinaPayload = {
        amount: filsAmount,
        currency_code: 'AED',
        message: `Order #${order.id.slice(0, 8)} - ${formData.firstName} ${formData.lastName}`,
        success_url: `${window.location.origin}/order-success/${order.id}`,
        cancel_url: `${window.location.origin}/checkout`,
        failure_url: `${window.location.origin}/checkout`,
        test: true,
        transaction_source: 'directApi',
        allow_tips: false,
        customer_phone: formData.phone
      };

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.ziina_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ziinaPayload)
      });

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.status}`);
      }

      const ziinaData = await response.json();

      if (ziinaData.payment_url || ziinaData.checkout_url) {
        // Redirect to Ziina payment page
        window.location.href = ziinaData.payment_url || ziinaData.checkout_url;
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Billing Information */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
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
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Delivery Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={deliveryType} onValueChange={setDeliveryType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery">Delivery (+$30)</SelectItem>
                <SelectItem value="pickup">Pickup (Free)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {deliveryType === 'delivery' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
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
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAE">United Arab Emirates</SelectItem>
                      <SelectItem value="SA">Saudi Arabia</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Order Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Special instructions for your order..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              {giftCardDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Gift Card:</span>
                  <span>-${giftCardDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coupon Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Coupon Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button onClick={applyCoupon} variant="outline">
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gift Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Gift Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter gift card code"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value)}
              />
              <Button onClick={applyGiftCard} variant="outline">
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleZiinaPayment}
              disabled={loading || total <= 0}
              className="w-full"
              size="lg"
            >
              {loading ? "Processing..." : `Pay with Ziina - $${total.toFixed(2)}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
