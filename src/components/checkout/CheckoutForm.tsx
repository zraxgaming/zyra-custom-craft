
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, ShoppingBag, Lock, Smartphone, Gift, Star } from "lucide-react";
import ZiinaPayment from "./ZiinaPayment";
import { CartItem } from "@/types/product";

interface CheckoutFormProps {
  items: CartItem[];
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ziina");
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

  const createOrder = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: subtotal,
          status: 'pending',
          payment_status: 'pending',
          payment_method: paymentMethod,
          shipping_address: formData,
          billing_address: formData
        })
        .select()
        .single();

      if (error) throw error;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      await supabase
        .from('order_items')
        .insert(orderItems);

      return order;
    } catch (error: any) {
      toast({
        title: "Order Creation Failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    const order = await createOrder();
    if (!order) return;

    try {
      await supabase
        .from('orders')
        .update({ 
          status: 'completed',
          payment_status: 'paid',
          tracking_number: transactionId
        })
        .eq('id', order.id);

      toast({
        title: "Payment Successful!",
        description: "Your order has been placed successfully",
      });

      onPaymentSuccess(order.id);
    } catch (error: any) {
      toast({
        title: "Order Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
  };

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Order Summary */}
      <Card className="h-fit bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950 dark:via-gray-900 dark:to-blue-950 border-2 border-purple-200 dark:border-purple-800 shadow-2xl animate-slide-in-left">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <ShoppingBag className="h-6 w-6 animate-bounce" />
            Order Summary
            <div className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
              {items.length} items
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="max-h-64 overflow-y-auto space-y-3">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm border border-purple-100 dark:border-purple-800 hover:shadow-lg transition-all duration-300 animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <Gift className="h-8 w-8 text-purple-400 animate-pulse" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{item.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span>Qty: {item.quantity}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-yellow-600 font-medium">Premium</span>
                  </div>
                  {item.customization && (
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      ✨ Customized
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-purple-700 dark:text-purple-300">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="bg-gradient-to-r from-purple-200 to-blue-200" />
          
          <div className="space-y-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 p-4 rounded-xl">
            <div className="flex justify-between text-lg">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Shipping</span>
              <span className="text-green-600 font-bold">Free ✨</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Tax</span>
              <span className="font-bold">Included</span>
            </div>
            <Separator className="bg-gradient-to-r from-purple-300 to-blue-300" />
            <div className="flex justify-between text-2xl font-bold text-purple-700 dark:text-purple-300 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg shadow-inner">
              <span>Total</span>
              <span className="animate-pulse">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <div className="space-y-6 animate-slide-in-right">
        <Card className="bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 border-2 border-purple-200 dark:border-purple-800 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Lock className="h-6 w-6 animate-pulse" />
              Shipping Information
              <div className="ml-auto text-sm bg-white/20 px-2 py-1 rounded">
                🔒 Secure
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-purple-700 dark:text-purple-300 font-semibold">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    className="border-2 border-purple-200 focus:border-purple-500 rounded-lg h-12 text-lg transition-all duration-300 hover:shadow-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-purple-700 dark:text-purple-300 font-semibold">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    className="border-2 border-purple-200 focus:border-purple-500 rounded-lg h-12 text-lg transition-all duration-300 hover:shadow-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-700 dark:text-purple-300 font-semibold">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="border-2 border-purple-200 focus:border-purple-500 rounded-lg h-12 text-lg transition-all duration-300 hover:shadow-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-purple-700 dark:text-purple-300 font-semibold">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="border-2 border-purple-200 focus:border-purple-500 rounded-lg h-12 text-lg transition-all duration-300 hover:shadow-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-purple-700 dark:text-purple-300 font-semibold">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="border-2 border-purple-200 focus:border-purple-500 rounded-lg h-12 text-lg transition-all duration-300 hover:shadow-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-purple-700 dark:text-purple-300 font-semibold">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="border-2 border-purple-200 focus:border-purple-500 rounded-lg h-12 text-lg transition-all duration-300 hover:shadow-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-purple-700 dark:text-purple-300 font-semibold">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="border-2 border-purple-200 focus:border-purple-500 rounded-lg h-12 text-lg transition-all duration-300 hover:shadow-lg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 border-2 border-purple-200 dark:border-purple-800 shadow-2xl animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <CreditCard className="h-6 w-6 animate-bounce" />
              Payment Method
              <div className="ml-auto text-sm bg-white/20 px-2 py-1 rounded">
                💳 Secure
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl bg-purple-50 dark:bg-purple-950 hover:shadow-lg transition-all duration-300">
                <RadioGroupItem value="ziina" id="ziina" className="border-purple-500" />
                <Label htmlFor="ziina" className="flex items-center gap-3 cursor-pointer flex-1 text-lg">
                  <Smartphone className="h-5 w-5 text-purple-600 animate-pulse" />
                  <span className="text-purple-700 dark:text-purple-300 font-semibold">Ziina (UAE)</span>
                  <div className="ml-auto bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded text-xs font-bold text-purple-700 dark:text-purple-300">
                    Recommended ⭐
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "ziina" && (
              <div className="animate-slide-in-up">
                <ZiinaPayment
                  amount={subtotal}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
