
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import { Loader2, User, Mail, Phone, CreditCard, Banknote } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CheckoutFormProps {
  subtotal: number;
  items: any[];
  onPaymentSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  subtotal,
  items,
  onPaymentSuccess,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { coupon, giftCard, setCoupon, setGiftCard, discount, giftCardAmount, clearCart } = useCart();
  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    otherPhone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ziina");

  const total = Math.max(0, subtotal - discount - giftCardAmount);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      // Check if any items are digital and handle redirect URL
      const digitalItems = items.filter(item => item.is_digital);
      
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id,
          total_amount: total,
          status: "pending",
          payment_status: "pending",
          payment_method: paymentMethod,
          notes: [
            form.name && `Name: ${form.name}`,
            form.email && `Email: ${form.email}`,
            form.phone && `Phone: ${form.phone}`,
            form.otherPhone && `Other phone: ${form.otherPhone}`,
          ].filter(Boolean).join("; "),
        })
        .select()
        .single();

      if (error) throw error;

      // Add order items
      if (order && items && items.length) {
        await supabase.from("order_items").insert(
          items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            customization: item.customization || null,
          }))
        );
      }

      // Handle payment based on method
      if (paymentMethod === "cash") {
        // For digital products, redirect immediately after order placement
        if (digitalItems.length > 0) {
          // Get the download URL from the first digital product
          const { data: productData } = await supabase
            .from('products')
            .select('meta_description') // Using meta_description to store download URL
            .eq('id', digitalItems[0].product_id)
            .single();
          
          if (productData?.meta_description) {
            window.open(productData.meta_description, '_blank');
          }
        }
        
        toast({ 
          title: "Order Placed!", 
          description: digitalItems.length > 0 
            ? "Digital products are available for download." 
            : "Please pay in store when collecting your order." 
        });
        clearCart();
        onPaymentSuccess(order.id);
        return;
      }

      // Handle Ziina payment
      const { data: configData } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "ziina_api_key")
        .single();

      if (!configData?.value) throw new Error("Ziina API key not configured.");

      const { data: envData } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_env')
        .single();
        
      const ziinaEnv = envData?.value ?? 'test';
      const endpoint = ziinaEnv === "prod"
        ? 'https://api-v2.ziina.com/api/payment_intent'
        : 'https://sandbox-api-v2.ziina.com/api/payment_intent';

      const payload = {
        amount: Math.round(total * 100),
        currency_code: "AED",
        metadata: { order_id: order.id },
        success_url: `${window.location.origin}/order-success/${order.id}`,
        cancel_url: `${window.location.origin}/order-failed?source=ziina&status=cancelled`,
        failure_url: `${window.location.origin}/order-failed?source=ziina&status=failed`
      };

      const paymentRes = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${configData.value}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const paymentResData = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(paymentResData.message || "Ziina payment failed");
      }

      if (paymentResData.id) {
        await supabase
          .from("orders")
          .update({ payment_intent_id: paymentResData.id })
          .eq("id", order.id);
      }

      if (paymentResData.next_action_url || paymentResData.payment_url || paymentResData.redirect_url) {
        window.location.assign(paymentResData.next_action_url || paymentResData.payment_url || paymentResData.redirect_url);
      } else {
        throw new Error("No payment URL returned from Ziina");
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({ 
        title: "Checkout failed", 
        description: error.message || "Could not process checkout", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Checkout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  required
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className="mt-1 h-11"
                />
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  required
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  className="mt-1 h-11"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone *
                </Label>
                <Input
                  id="phone"
                  value={form.phone}
                  required
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="mt-1 h-11"
                />
              </div>
              <div>
                <Label htmlFor="otherPhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Alternative Phone
                </Label>
                <Input
                  id="otherPhone"
                  value={form.otherPhone}
                  onChange={(e) => setForm(f => ({ ...f, otherPhone: e.target.value }))}
                  className="mt-1 h-11"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  paymentMethod === "ziina" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setPaymentMethod("ziina")}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="ziina"
                    checked={paymentMethod === "ziina"}
                    onChange={() => setPaymentMethod("ziina")}
                    className="accent-primary"
                  />
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Ziina Payment</p>
                    <p className="text-sm text-muted-foreground">Pay securely online</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  paymentMethod === "cash" 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="accent-primary"
                  />
                  <Banknote className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Cash on Pickup</p>
                    <p className="text-sm text-muted-foreground">Pay when collecting</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>AED {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-AED {discount.toFixed(2)}</span>
                </div>
              )}
              {giftCardAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Gift Card</span>
                  <span>-AED {giftCardAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">AED {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isSubmitting || !form.name || !form.email || !form.phone || total < 0.01}
            className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold text-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </div>
            ) : (
              paymentMethod === "ziina" 
                ? `Pay AED ${total.toFixed(2)} with Ziina`
                : `Place Order - Pay Cash on Pickup (AED ${total.toFixed(2)})`
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutForm;
