import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import { Loader2, Smartphone, Check } from "lucide-react";
import CouponForm from "@/components/checkout/CouponForm";
import GiftCardForm from "@/components/checkout/GiftCardForm";
import ZiinaPayment from "@/components/checkout/ZiinaPayment";
import OrderSummary from "@/components/checkout/OrderSummary";

interface CheckoutFormProps {
  subtotal: number;
  items: any[];
  onPaymentSuccess: (orderId: string) => void;
  // keep deliveryOptions, paymentMethods for future use
  deliveryOptions?: { label: string; value: string }[];
  paymentMethods?: { label: string; value: string }[];
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
  const [ziinaIntentId, setZiinaIntentId] = useState<string | null>(null);

  const total = Math.max(0, subtotal - discount - giftCardAmount);

  // Only keep paymentIntent logic, rest delivery/shipping is hidden (may keep as comment for future)
  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      // 1. Save order as PENDING and get orderId
      // customer_name is NOT inserted directly to avoid column missing errors.
      // Instead, store customer details in notes so checkout never fails.
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id,
          total_amount: total,
          status: "pending",
          payment_status: "pending",
          payment_method: paymentMethod,
          // customer_name: form.name, // COMMENTED OUT. See note above.
          // Store customer info in notes to avoid schema issues.
          notes: [
            form.name && `Name: ${form.name}`,
            form.otherPhone && `Other phone: ${form.otherPhone}`,
            form.email && `Email: ${form.email}`,
          ].filter(Boolean).join("; "),
        })
        .select()
        .single();
      if (error) throw error;

      // 2. Add order_items
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

      // Payment: if cash, show simple success toast and call onPaymentSuccess
      if (paymentMethod === "cash") {
        toast({ title: "Order Placed! Pay on Pickup", description: "Please pay in store when collecting your order." });
        clearCart();
        onPaymentSuccess(order.id);
        setIsSubmitting(false);
        return;
      }

      // 3. Start Ziina payment (skip if not ziina)
      const { data: configData } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "ziina_api_key")
        .single();
      if (!configData?.value) throw new Error("Ziina API key not set.");
      const ziinaApiKey = configData.value as string;

      const { data: envData } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_env')
        .single();
      const ziinaEnv = envData?.value ?? 'test';
      const endpoint = ziinaEnv === "prod"
        ? 'https://api-v2.ziina.com/api/payment_intent'
        : 'https://sandbox-api-v2.ziina.com/api/payment_intent';

      // Prepare payload
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
          "Authorization": `Bearer ${ziinaApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const paymentResData = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(paymentResData.message || "Ziina payment failed");
      }
      // Save payment intent ID
      if (paymentResData.id) {
        await supabase
          .from("orders")
          .update({ payment_intent_id: paymentResData.id })
          .eq("id", order.id);
        setZiinaIntentId(paymentResData.id);
      }
      // Redirect to payment
      if (paymentResData.next_action_url || paymentResData.payment_url || paymentResData.redirect_url) {
        window.location.assign(paymentResData.next_action_url || paymentResData.payment_url || paymentResData.redirect_url);
      } else {
        throw new Error("No payment URL returned from Ziina");
      }

      toast({ title: "Payment Started", description: "You will be redirected to complete payment." });
    } catch (error: any) {
      toast({ title: "Checkout failed", description: error.message || "Could not process checkout", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show store pickup info, hide shipping, etc.
  return (
    <form className="max-w-2xl mx-auto space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8" onSubmit={e => { e.preventDefault(); handleCheckout(); }}>
      <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
        Store Pickup Checkout
      </h2>
      <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded border border-yellow-400 font-medium text-center">
        <b>Store Pickup Only:</b> Collect your order at our store! No deliveries.
      </div>
      <div className="space-y-3">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={form.name}
            required
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="bg-background text-foreground border-border"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            required
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="bg-background text-foreground border-border"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={form.phone}
            required
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="bg-background text-foreground border-border"
          />
        </div>
        <div>
          <Label htmlFor="otherPhone">Other Phone (optional)</Label>
          <Input
            id="otherPhone"
            value={form.otherPhone}
            onChange={e => setForm(f => ({ ...f, otherPhone: e.target.value }))}
            className="bg-background text-foreground border-border"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 font-medium">
          <input
            type="radio"
            name="payment_method"
            value="ziina"
            checked={paymentMethod === "ziina"}
            onChange={() => setPaymentMethod("ziina")}
            className="accent-primary"
          />
          Ziina (Pay online)
        </label>
        <label className="flex items-center gap-2 font-medium">
          <input
            type="radio"
            name="payment_method"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
            className="accent-primary"
          />
          Cash on Pickup
        </label>
      </div>
      <div className="space-y-4">
        <CouponForm
          onCouponApply={setCoupon}
          onCouponRemove={() => setCoupon(null)}
          appliedCoupon={coupon}
          orderTotal={subtotal}
        />
        <GiftCardForm
          onGiftCardApply={setGiftCard}
          onGiftCardRemove={() => setGiftCard(null)}
          appliedGiftCard={giftCard}
          orderTotal={subtotal - discount}
        />
      </div>
      {/* No shipping/delivery UI for now */}
      {/* <OrderSummary items={items} deliveryCost={0} /> */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !form.name || !form.email || !form.phone || total < 0.01}
          className="w-full bg-gradient-to-r from-primary to-purple-600 text-white"
        >
          {isSubmitting ? "Processing..." : paymentMethod === "ziina" 
            ? `Pay AED ${total.toFixed(2)} with Ziina`
            : `Place Order - Pay Cash on Pickup (AED ${total.toFixed(2)})`}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;

// src/components/checkout/CheckoutForm.tsx is getting long; consider refactoring.
