
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
import { Loader2, CreditCard, ShoppingBag, Lock, Smartphone, Gift } from "lucide-react";
import ZiinaPayment from "@/components/payment/ZiinaPayment";

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

  const handlePaymentSuccess = async (orderId: string) => {
    try {
      // Send order confirmation email
      await fetch('https://hooks.zapier.com/hooks/catch/18195840/2jeyebc/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          type: 'order_confirmation',
          to: formData.email,
          subject: `Order Confirmation - ${orderId}`,
          name: `${formData.firstName} ${formData.lastName}`,
          order_id: orderId,
          items: items.map(item => ({
            name: item.name,
            qty: item.quantity,
            price: `$${(item.price * item.quantity).toFixed(2)}`
          })),
          total: `$${subtotal.toFixed(2)}`,
          message: "We're processing your order and will notify you when it ships."
        })
      });

      toast({
        title: "Order Placed Successfully!",
        description: "You will receive a confirmation email shortly.",
      });

      onPaymentSuccess(orderId);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      onPaymentSuccess(orderId);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
  };

  const orderData = {
    ...formData,
    items,
    subtotal,
    user_id: user?.id
  };

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Order Summary */}
      <Card className="h-fit bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300 text-xl">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <ShoppingBag className="h-6 w-6" />
            </div>
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm border border-purple-100 dark:border-purple-800 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Gift className="h-8 w-8 text-purple-500" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-lg text-purple-700 dark:text-purple-300">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          
          <Separator className="bg-purple-200 dark:bg-purple-800" />
          
          <div className="space-y-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
            <div className="flex justify-between text-lg">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Shipping</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <Separator className="bg-purple-200 dark:bg-purple-800" />
            <div className="flex justify-between text-xl font-bold text-purple-700 dark:text-purple-300">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300 text-xl">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Lock className="h-6 w-6" />
              </div>
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    className="h-12 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl bg-white/80 dark:bg-gray-800/80 transition-all duration-300 focus:shadow-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    className="h-12 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl bg-white/80 dark:bg-gray-800/80 transition-all duration-300 focus:shadow-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="h-12 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl bg-white/80 dark:bg-gray-800/80 transition-all duration-300 focus:shadow-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="h-12 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl bg-white/80 dark:bg-gray-800/80 transition-all duration-300 focus:shadow-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="h-12 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl bg-white/80 dark:bg-gray-800/80 transition-all duration-300 focus:shadow-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold text-gray-700 dark:text-gray-300">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="h-12 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl bg-white/80 dark:bg-gray-800/80 transition-all duration-300 focus:shadow-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-sm font-semibold text-gray-700 dark:text-gray-300">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="h-12 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl bg-white/80 dark:bg-gray-800/80 transition-all duration-300 focus:shadow-lg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 shadow-xl hover:shadow-2xl transition-all duration-300 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300 text-xl">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 dark:hover:bg-purple-900 transition-all duration-300">
                <RadioGroupItem value="ziina" id="ziina" className="border-purple-500" />
                <Label htmlFor="ziina" className="flex items-center gap-3 cursor-pointer flex-1 font-medium">
                  <div className="p-1 bg-purple-100 dark:bg-purple-800 rounded">
                    <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-purple-700 dark:text-purple-300">Ziina Payment (UAE)</span>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "ziina" && (
              <div className="animate-fade-in">
                <ZiinaPayment
                  amount={subtotal}
                  orderData={orderData}
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

export default EnhancedCheckoutForm;
