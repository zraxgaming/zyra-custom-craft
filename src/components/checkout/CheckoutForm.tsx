
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShoppingBag, Lock, Smartphone, Gift, CreditCard } from "lucide-react";
import ZiinaPayment from "./ZiinaPayment";
import GiftCardSection from "./GiftCardSection";

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
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);
  const [showZiinaPayment, setShowZiinaPayment] = useState(false);
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

  const finalAmount = Math.max(0, subtotal - (appliedGiftCard?.amount || 0));

  const handleGiftCardOnly = async () => {
    if (finalAmount > 0) {
      toast({
        title: "Payment Required",
        description: "Gift card doesn't cover the full amount. Please use Ziina for remaining balance.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
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
          user_id: user?.id,
          total_amount: subtotal,
          status: 'completed',
          payment_status: 'paid',
          payment_method: 'gift_card',
          shipping_address: formData,
          billing_address: formData
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      await supabase.from('order_items').insert(orderItems);

      // Update gift card balance
      await supabase
        .from('gift_cards')
        .update({ amount: appliedGiftCard.amount - subtotal })
        .eq('id', appliedGiftCard.id);

      toast({
        title: "Order Completed! 🎉",
        description: "Your order has been placed successfully using gift card",
      });

      onPaymentSuccess(order.id);
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Unable to process order",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleZiinaSuccess = async (transactionId: string) => {
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

      // Update gift card if applied
      if (appliedGiftCard && appliedGiftCard.amount > 0) {
        const usedAmount = Math.min(appliedGiftCard.amount, subtotal);
        await supabase
          .from('gift_cards')
          .update({ amount: appliedGiftCard.amount - usedAmount })
          .eq('id', appliedGiftCard.id);
      }

      toast({
        title: "Payment Successful! 🎉",
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
          total_amount: finalAmount,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'ziina',
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

      await supabase.from('order_items').insert(orderItems);
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

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
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
            <div key={`${item.product_id}-${index}`} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Gift className="h-6 w-6 text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-purple-700 dark:text-purple-300">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedGiftCard && (
              <div className="flex justify-between text-green-600">
                <span>Gift Card Applied</span>
                <span>-${Math.min(appliedGiftCard.amount, subtotal).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold text-purple-700 dark:text-purple-300">
              <span>Total to Pay</span>
              <span>${finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Lock className="h-5 w-5" />
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
                <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <GiftCardSection
          onGiftCardApplied={setAppliedGiftCard}
          appliedGiftCard={appliedGiftCard}
          totalAmount={subtotal}
        />

        <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-purple-700 dark:text-purple-300">Payment Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {finalAmount <= 0 && appliedGiftCard ? (
              <Button
                onClick={handleGiftCardOnly}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4 mr-2" />
                    Complete Order with Gift Card
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                {!showZiinaPayment ? (
                  <Button
                    onClick={() => setShowZiinaPayment(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Pay {finalAmount > 0 ? `$${finalAmount.toFixed(2)}` : 'Free'} with Ziina
                  </Button>
                ) : (
                  <ZiinaPayment
                    amount={finalAmount}
                    onSuccess={handleZiinaSuccess}
                    onError={(error) => toast({
                      title: "Payment Error",
                      description: error,
                      variant: "destructive"
                    })}
                    items={items}
                    shippingData={formData}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
