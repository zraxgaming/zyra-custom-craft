import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Smartphone, HandCoins } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutFormProps {
  subtotal: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ subtotal }) => {
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form data state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"ziina" | "cash">("ziina");
  // for dark mode readability
  const darkBgClass = "bg-gray-950";

  useEffect(() => {
    if (user) {
      setName(
        user.user_metadata?.first_name && user.user_metadata?.last_name
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
          : user.user_metadata?.name || ""
      );
      setEmail(user.email || "");
    }
  }, [user]);

  // Helper to display order summary in the checkout
  const renderOrderSummary = () => (
    <div className={`border rounded-lg p-3 bg-gray-50 dark:${darkBgClass} mt-4`}>
      <div className="font-semibold mb-2 text-gray-800 dark:text-white">Order Items</div>
      {items.map(item => (
        <div key={item.id} className="flex justify-between items-center py-1 text-sm">
          <div>
            <span className="font-medium">{item.name}</span>
            {item.customization && typeof item.customization === "object" && Object.keys(item.customization).length > 0 && (
              <span className="ml-2 text-xs text-purple-600">[custom: {(item.customization as any).text || "y"}]</span>
            )}
            <span className="ml-2 text-gray-500">x{item.quantity}</span>
          </div>
          <div className="text-right whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      ))}
    </div>
  );

  // Helper: Check all customizable products have customization before order
  const hasUncustomizedCustomProduct = items.some(
    item =>
      (item.customization !== undefined && item.customization !== null && item.name?.toLowerCase().includes("custom")) &&
      (!item.customization || Object.keys(item.customization).length === 0)
  );

  const handleOrder = async () => {
    // Validate form fields
    if (!name || !email || !phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    // Block empty cart
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    // Prevent non-customized customizable products
    if (hasUncustomizedCustomProduct) {
      toast({
        title: "Customization Required",
        description: "Please provide customization for all customizable products before checkout.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Compose order object; save customizations
      const orderPayload = {
        user_id: user?.id,
        total_amount: subtotal,
        payment_status: "pending",
        payment_method: paymentMethod,
        shipping_address: {
          name,
          email,
          phone,
          note: "Pickup Only",
        },
        billing_address: {
          name,
          email,
          phone,
          note: "Pickup Only",
        },
        status: "pending",
      };
      // Insert order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select()
        .single();
      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Failed to create order.");
      }
      // Insert order items and make sure customizations are saved!
      if (items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: orderData.id,
          product_id: item.id || item.product_id,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization || null,
        }));
        await supabase.from("order_items").insert(orderItems);

        // Ensure correct inventory deduction using the Supabase 'decrement_stock' function for each item
        for (const item of items) {
          if (item.product_id) {
            await supabase.rpc('decrement_stock', {
              product_id_input: item.product_id,
              amount_input: item.quantity
            });
          }
        }
      }

      if (paymentMethod === "ziina") {
        // Get keys
        const { data: configData, error: configError } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "ziina_api_key")
          .maybeSingle();
        if (configError || !configData?.value) throw new Error("Ziina integration not set up.");
        const ziinaApiKey = configData.value;
        const aedAmount = Math.round(subtotal * 3.67 * 100);
        // Prepare payload
        const paymentIntentPayload = {
          amount: aedAmount,
          currency_code: "AED",
          metadata: { order_id: orderData.id },
          success_url: `${window.location.origin}/order-success/${orderData.id}`,
          cancel_url: `${window.location.origin}/order-failed?orderId=${orderData.id}&reason=cancel`,
          failure_url: `${window.location.origin}/order-failed?orderId=${orderData.id}&reason=failure`,
        };
        // Call Ziina, improve handling for all possible redirect urls
        const response = await fetch("https://api-v2.ziina.com/api/payment_intent", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ziinaApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentIntentPayload),
        });
        const paymentResp = await response.json();
        // Save payment_intent_id if available
        if (paymentResp.id) {
          await supabase
            .from("orders")
            .update({ payment_intent_id: paymentResp.id })
            .eq("id", orderData.id);
        }
        // Find redirect
        const redirectUrl = 
          paymentResp.next_action_url ||
          paymentResp.payment_url ||
          paymentResp.redirect_url ||
          (paymentResp.next_action && paymentResp.next_action.url); // fallback
        if (!response.ok || !redirectUrl) {
          // CHECK for failure/cancellation from response
          window.location.href = `/order-failed?orderId=${orderData.id}&reason=ziina`;
          return;
        }
        // Redirect to Ziina
        window.location.href = redirectUrl;
        return;
      } else {
        // Cash on pickup
        toast({
          title: "Order Placed (Pickup)",
          description: "Your order has been created. Please pick up and pay at the store.",
        });
        await clearCart(); // Fix: Await clearing the cart
        navigate(`/order-success/${orderData.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message || "Unable to place order.",
        variant: "destructive",
      });
      // On error, route to failed page
      navigate(`/order-failed`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-8 shadow-lg border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle>
          Checkout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* WARNING */}
        <div className="bg-yellow-200 border-l-4 border-yellow-600 text-yellow-900 dark:bg-yellow-700/25 dark:text-yellow-100 px-4 py-3 rounded-lg mb-4">
          <strong>Pickup Only!</strong> All orders must be picked up in person. <br/> <span>No delivery or shipping offered at this time.</span>
        </div>
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="user@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            placeholder="+971 50 123 4567"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>
        {/* Payment Method: only show Ziina and Cash on Pickup */}
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <div className="flex gap-4 mt-2">
            <Button
              type="button"
              variant={paymentMethod === "ziina" ? "default" : "outline"}
              className={paymentMethod === "ziina" ? "border-purple-500" : ""}
              onClick={() => setPaymentMethod("ziina")}
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Ziina Payment (AED)
            </Button>
            <Button
              type="button"
              variant={paymentMethod === "cash" ? "default" : "outline"}
              className={paymentMethod === "cash" ? "border-purple-500" : ""}
              onClick={() => setPaymentMethod("cash")}
            >
              <HandCoins className="w-4 h-4 mr-1" />
              Cash on Pickup
            </Button>
          </div>
        </div>
        {paymentMethod === "ziina" && (
          <div className="bg-blue-50 p-3 text-blue-700 rounded-lg border border-blue-200 mt-2">
            You will be redirected to our payment provider (Ziina) to securely pay for your order online (AED). Receipt required at pickup.
          </div>
        )}
        {paymentMethod === "cash" && (
          <div className="bg-gray-50 p-3 text-gray-700 rounded-lg border border-gray-200 mt-2">
            Pay cash when you come to pick up your order.
          </div>
        )}
        {/* Show Order Summary */}
        {renderOrderSummary()}
        {/* Order Summary */}
        <div className="pt-3 flex justify-end">
          <div>
            <div className="text-lg font-semibold text-right">Subtotal: <span className="text-purple-600">{subtotal ? `$${subtotal.toFixed(2)}` : "$0.00"}</span></div>
            <div className="text-2xl font-bold text-right">Total: <span className="text-purple-700">{subtotal ? `$${subtotal.toFixed(2)}` : "$0.00"}</span></div>
          </div>
        </div>
        {/* Place Order */}
        <Button
          className="w-full mt-2 text-lg"
          size="lg"
          onClick={handleOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Placing Order...
            </>
          ) : paymentMethod === "ziina" ? (
            <>Pay & Order with Ziina</>
          ) : (
            <>Place Order (Cash on Pickup)</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
