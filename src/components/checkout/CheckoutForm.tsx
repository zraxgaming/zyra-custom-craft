
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, ShoppingBag, Lock, Smartphone, Gift, Star } from "lucide-react";
import ZiinaPayment from "./ZiinaPayment";
import type { CartItem } from "@/components/cart/CartProvider";

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

  const handlePaymentSuccess = async (orderId: string) => {
    toast({
      title: "Payment Successful! ✨",
      description: "Your order has been placed successfully",
    });
    onPaymentSuccess(orderId);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
  };

  const shippingData = {
    ...formData,
    user_id: user?.id
  };

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Order Summary */}
      <Card className="h-fit bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 animate-slide-in-right shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full animate-pulse">
              <ShoppingBag className="h-5 w-5" />
            </div>
            Order Summary
            <div className="ml-auto flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 animate-spin" />
              <span className="text-sm">Premium</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-64 overflow-y-auto space-y-3">
            {items.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm animate-slide-in-up hover:scale-105 transition-transform duration-300 shadow-md" 
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl flex items-center justify-center overflow-hidden animate-bounce">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Gift className="h-7 w-7 text-purple-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-purple-800 dark:text-purple-200">{item.name}</h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-purple-700 dark:text-purple-300 animate-pulse">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <Separator className="bg-purple-200 dark:bg-purple-800" />
          
          <div className="space-y-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <div className="flex justify-between text-purple-700 dark:text-purple-300">
              <span>Subtotal</span>
              <span className="animate-pulse">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-purple-700 dark:text-purple-300">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold animate-bounce">Free ✨</span>
            </div>
            <div className="flex justify-between text-purple-700 dark:text-purple-300">
              <span>Taxes</span>
              <span className="text-green-600 font-semibold">Included</span>
            </div>
            <Separator className="bg-purple-200 dark:bg-purple-800" />
            <div className="flex justify-between text-xl font-bold text-purple-800 dark:text-purple-200 p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg animate-pulse">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 animate-slide-in-left shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full animate-spin">
                <Lock className="h-5 w-5" />
              </div>
              Shipping Information
              <div className="ml-auto text-sm bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full animate-bounce">
                Secure 🔒
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="animate-slide-in-up" style={{animationDelay: '100ms'}}>
                  <Label htmlFor="firstName" className="text-purple-700 dark:text-purple-300">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-200 transition-all duration-300"
                  />
                </div>
                <div className="animate-slide-in-up" style={{animationDelay: '200ms'}}>
                  <Label htmlFor="lastName" className="text-purple-700 dark:text-purple-300">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-200 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="animate-slide-in-up" style={{animationDelay: '300ms'}}>
                <Label htmlFor="email" className="text-purple-700 dark:text-purple-300">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-200 transition-all duration-300"
                />
              </div>

              <div className="animate-slide-in-up" style={{animationDelay: '400ms'}}>
                <Label htmlFor="phone" className="text-purple-700 dark:text-purple-300">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+971 50 123 4567"
                  required
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-200 transition-all duration-300"
                />
              </div>

              <div className="animate-slide-in-up" style={{animationDelay: '500ms'}}>
                <Label htmlFor="address" className="text-purple-700 dark:text-purple-300">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-200 transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="animate-slide-in-up" style={{animationDelay: '600ms'}}>
                  <Label htmlFor="city" className="text-purple-700 dark:text-purple-300">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-200 transition-all duration-300"
                  />
                </div>
                <div className="animate-slide-in-up" style={{animationDelay: '700ms'}}>
                  <Label htmlFor="zipCode" className="text-purple-700 dark:text-purple-300">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-200 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 animate-scale-in shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full animate-pulse">
                <CreditCard className="h-5 w-5" />
              </div>
              Payment Method
              <div className="ml-auto text-sm bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-full animate-bounce">
                Secure Payment ✓
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="animate-fade-in">
              <div className="flex items-center space-x-3 p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 hover:scale-105 transition-transform duration-300 animate-bounce">
                <RadioGroupItem value="ziina" id="ziina" className="border-purple-500" />
                <Label htmlFor="ziina" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full animate-spin">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-purple-700 dark:text-purple-300 font-semibold">Ziina (UAE)</span>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Secure payment gateway for UAE</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "ziina" && (
              <div className="animate-slide-in-up">
                <ZiinaPayment
                  amount={subtotal}
                  items={items}
                  shippingData={shippingData}
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
