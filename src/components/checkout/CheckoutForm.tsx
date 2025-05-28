
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  CreditCard, 
  ShoppingBag, 
  Lock, 
  Smartphone, 
  Gift,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Tag
} from "lucide-react";
import ZiinaPayment from "@/components/payment/ZiinaPayment";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ziina");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);
  const [finalAmount, setFinalAmount] = useState(subtotal);
  
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "UAE"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missing.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    // Validate phone number for Ziina
    if (paymentMethod === 'ziina' && !formData.phone) {
      toast({
        title: "Phone Required",
        description: "Phone number is required for Ziina payments",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const applyGiftCard = async () => {
    if (!giftCardCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a gift card code",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: giftCard, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', giftCardCode.trim())
        .eq('is_active', true)
        .single();

      if (error || !giftCard) {
        toast({
          title: "Invalid Gift Card",
          description: "Gift card not found or already used",
          variant: "destructive"
        });
        return;
      }

      if (giftCard.amount <= 0) {
        toast({
          title: "Gift Card Empty",
          description: "This gift card has no remaining balance",
          variant: "destructive"
        });
        return;
      }

      const discountAmount = Math.min(giftCard.amount, subtotal);
      setAppliedGiftCard(giftCard);
      setFinalAmount(subtotal - discountAmount);
      
      toast({
        title: "Gift Card Applied",
        description: `$${discountAmount.toFixed(2)} discount applied`,
      });
    } catch (error) {
      console.error('Error applying gift card:', error);
      toast({
        title: "Error",
        description: "Failed to apply gift card",
        variant: "destructive"
      });
    }
  };

  const removeGiftCard = () => {
    setAppliedGiftCard(null);
    setFinalAmount(subtotal);
    setGiftCardCode("");
    toast({
      title: "Gift Card Removed",
      description: "Gift card discount has been removed",
    });
  };

  const handlePaymentSuccess = async (orderId: string) => {
    // Update gift card balance if applied
    if (appliedGiftCard) {
      const usedAmount = Math.min(appliedGiftCard.amount, subtotal);
      const newBalance = appliedGiftCard.amount - usedAmount;
      
      await supabase
        .from('gift_cards')
        .update({ 
          amount: newBalance,
          is_active: newBalance > 0
        })
        .eq('id', appliedGiftCard.id);
    }

    onPaymentSuccess(orderId);
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
    subtotal: finalAmount,
    user_id: user?.id,
    gift_card_applied: appliedGiftCard
  };

  // Check if any items require customization
  const hasCustomizableItems = items.some(item => item.requiresCustomization && !item.customization);

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <Card className="h-fit bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <ShoppingBag className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg backdrop-blur-sm animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Gift className="h-8 w-8 text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                {item.customization && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      Customized
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.customization.text && `Text: ${item.customization.text}`}
                      {item.customization.color && ` | Color: ${item.customization.color}`}
                    </p>
                  </div>
                )}
              </div>
              <p className="font-bold text-purple-700 dark:text-purple-300">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          
          <Separator />
          
          {/* Gift Card Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Gift Card or Coupon</Label>
            {!appliedGiftCard ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter gift card code"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={applyGiftCard}
                  variant="outline"
                  className="shrink-0"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Apply
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Gift Card Applied: {appliedGiftCard.code}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Discount: -${Math.min(appliedGiftCard.amount, subtotal).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    onClick={removeGiftCard}
                    variant="ghost"
                    size="sm"
                    className="text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedGiftCard && (
              <div className="flex justify-between text-green-600">
                <span>Gift Card Discount</span>
                <span>-${Math.min(appliedGiftCard.amount, subtotal).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold text-purple-700 dark:text-purple-300">
              <span>Total</span>
              <span>${finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <div className="space-y-6">
        {/* Shipping Information */}
        <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <MapPin className="h-5 w-5" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+971 50 123 4567"
                  required
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="address" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Address *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input
                  id="address2"
                  value={formData.address2}
                  onChange={(e) => handleInputChange('address2', e.target.value)}
                  className="border-purple-200 focus:border-purple-500"
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
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Emirate</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full h-10 px-3 border border-purple-200 bg-background rounded-md focus:border-purple-500"
                  >
                    <option value="UAE">United Arab Emirates</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="KW">Kuwait</option>
                    <option value="QA">Qatar</option>
                    <option value="BH">Bahrain</option>
                    <option value="OM">Oman</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customization Warning */}
        {hasCustomizableItems && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Gift className="h-5 w-5" />
                <p className="font-medium">Customization Required</p>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Some items in your cart require customization. Please go back to customize them before checkout.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Payment Method */}
        <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Lock className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50 dark:bg-purple-950">
                <RadioGroupItem value="ziina" id="ziina" />
                <Label htmlFor="ziina" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Smartphone className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-700 dark:text-purple-300">Ziina (UAE)</span>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "ziina" && finalAmount > 0 && (
              <ZiinaPayment
                amount={finalAmount}
                orderData={orderData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                disabled={!validateForm() || hasCustomizableItems}
              />
            )}

            {finalAmount === 0 && (
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <Gift className="h-12 w-12 mx-auto text-green-600 mb-3" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  Order Fully Covered!
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                  Your gift card covers the entire order amount.
                </p>
                <Button 
                  onClick={() => handlePaymentSuccess('gift-card-order')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!validateForm() || hasCustomizableItems}
                >
                  Complete Order
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
