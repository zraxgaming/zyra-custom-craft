
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/product";
import ZiinaPayment from "./ZiinaPayment";
import PayPalPayment from "./PayPalPayment";
import { CreditCard, Truck, Shield, Package, MapPin, Phone, Mail } from "lucide-react";

interface CheckoutFormProps {
  items: CartItem[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ items, subtotal, onPaymentSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ziina' | 'paypal' | 'cod'>('ziina');

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UAE'
  });

  const shipping = 15.00;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const createOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your order",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          currency: 'USD',
          payment_method: paymentMethod,
          status: 'pending',
          shipping_address: shippingInfo,
          billing_address: shippingInfo
        })
        .select()
        .single();

      if (error) throw error;

      // Add order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order.id;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order creation failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handlePaymentSuccess = async () => {
    const orderId = await createOrder();
    if (orderId) {
      onPaymentSuccess(orderId);
    }
  };

  const handleCODOrder = async () => {
    setLoading(true);
    try {
      const orderId = await createOrder();
      if (orderId) {
        toast({
          title: "Order placed successfully!",
          description: "You will pay when your order is delivered.",
        });
        onPaymentSuccess(orderId);
      }
    } catch (error) {
      console.error('COD order error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return shippingInfo.firstName && shippingInfo.lastName && 
           shippingInfo.email && shippingInfo.phone && 
           shippingInfo.address && shippingInfo.city;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto animate-fade-in">
      {/* Shipping Information */}
      <div className="space-y-6">
        <Card className="border-2 border-primary/20 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20 animate-slide-in-left">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                <Input
                  id="firstName"
                  value={shippingInfo.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="mt-1 border-2 focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                <Input
                  id="lastName"
                  value={shippingInfo.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="mt-1 border-2 focus:border-purple-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={shippingInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1 border-2 focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone *
              </Label>
              <Input
                id="phone"
                value={shippingInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1 border-2 focus:border-purple-500 transition-colors"
                placeholder="+971 50 123 4567"
                required
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
              <Input
                id="address"
                value={shippingInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="mt-1 border-2 focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                <Input
                  id="city"
                  value={shippingInfo.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="mt-1 border-2 focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-sm font-medium">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="mt-1 border-2 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border-2 border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-900/20 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="ziina"
                    checked={paymentMethod === 'ziina'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'ziina')}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-purple-700 dark:text-purple-300">Ziina Payment</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Secure payment via Ziina</div>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
                </label>

                <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-blue-700 dark:text-blue-300">PayPal</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pay with your PayPal account</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                    className="w-4 h-4 text-green-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-green-700 dark:text-green-300">Cash on Delivery</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive your order</div>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card className="border-2 border-orange-200 shadow-xl bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-900/20 animate-slide-in-right">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </div>
                    {item.customization?.text && (
                      <div className="text-xs text-purple-600 dark:text-purple-400">
                        Custom: {item.customization.text}
                      </div>
                    )}
                  </div>
                  <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping
                  </span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-purple-700 dark:text-purple-300">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {paymentMethod === 'ziina' && (
                  <ZiinaPayment
                    amount={total}
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => {
                      console.error('Ziina payment error:', error);
                      toast({
                        title: "Payment failed",
                        description: "Please try again or choose a different payment method.",
                        variant: "destructive",
                      });
                    }}
                    disabled={!isFormValid()}
                  />
                )}

                {paymentMethod === 'paypal' && (
                  <PayPalPayment
                    amount={total}
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => {
                      console.error('PayPal payment error:', error);
                      toast({
                        title: "Payment failed",
                        description: "Please try again or choose a different payment method.",
                        variant: "destructive",
                      });
                    }}
                  />
                )}

                {paymentMethod === 'cod' && (
                  <Button
                    onClick={handleCODOrder}
                    disabled={loading || !isFormValid()}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {loading ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-4">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure checkout powered by SSL encryption</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
