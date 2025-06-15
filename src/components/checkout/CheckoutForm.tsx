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

  const handleOrder = async () => {
    // Check form fields
    if (!name || !email || !phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      // Compose order object, save as USD for db, pay in AED for Ziina
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

      // Insert order items
      if (items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: orderData.id,
          product_id: item.id || item.product_id,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization || null,
        }));
        await supabase.from("order_items").insert(orderItems);
      }

      if (paymentMethod === "ziina") {
        // Get ziina_api_key from site_config
        const { data: configData, error: configError } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "ziina_api_key")
          .maybeSingle();
        if (configError || !configData?.value) {
          throw new Error("Ziina integration not set up.");
        }
        const ziinaApiKey = configData.value;
        const aedAmount = Math.round(subtotal * 3.67 * 100);

        // Prepare the payload for Ziina
        const paymentIntentPayload = {
          amount: aedAmount,
          currency_code: "AED",
          metadata: { order_id: orderData.id },
          success_url: `${window.location.origin}/order-success/${orderData.id}`,
          cancel_url: `${window.location.origin}/checkout`,
          failure_url: `${window.location.origin}/checkout`,
        };

        // Call Ziina payment intent API
        const response = await fetch("https://api-v2.ziina.com/api/payment_intent", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ziinaApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentIntentPayload),
        });
        const paymentResp = await response.json();

        // Always save payment_intent_id to the order if available
        if (paymentResp.id) {
          await supabase
            .from("orders")
            .update({ payment_intent_id: paymentResp.id })
            .eq("id", orderData.id);
        }
        if (!response.ok || !paymentResp.next_action_url) {
          throw new Error(paymentResp.message || "Failed to get payment redirect URL from Ziina.");
        }
        // Redirect
        window.location.href = paymentResp.next_action_url;
        return;
      } else {
        // Cash on pickup: show success & clear cart
        toast({
          title: "Order Placed (Pickup)",
          description: "Your order has been created. Please pick up and pay at the store.",
        });
        clearCart();
        navigate(`/order-success/${orderData.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message || "Unable to place order.",
        variant: "destructive",
      });
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
