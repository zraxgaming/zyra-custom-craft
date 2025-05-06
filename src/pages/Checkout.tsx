
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/components/cart/CartProvider";
import { supabase } from "@/integrations/supabase/client";
import { ShippingAddress } from "@/types/checkout";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, clearCart, subtotal } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping address state
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: ""
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (state.items.length === 0) {
      navigate("/shop");
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Please add items before checkout.",
      });
    }
  }, [navigate, state.items.length, toast]);

  // Load user info if logged in
  useEffect(() => {
    if (user) {
      const loadUserInfo = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error) throw error;

          if (data && data.shipping_addresses) {
            // Safely handle shipping addresses from JSON
            let shippingAddresses: ShippingAddress[] = [];
            
            try {
              // Check if it's a string that needs to be parsed
              if (typeof data.shipping_addresses === 'string') {
                shippingAddresses = JSON.parse(data.shipping_addresses);
              } 
              // Check if it's already an array
              else if (Array.isArray(data.shipping_addresses)) {
                // Ensure each item in the array conforms to ShippingAddress interface
                shippingAddresses = data.shipping_addresses.map((addr: any) => ({
                  fullName: addr.fullName || "",
                  addressLine1: addr.addressLine1 || "",
                  addressLine2: addr.addressLine2 || "",
                  city: addr.city || "",
                  state: addr.state || "",
                  zipCode: addr.zipCode || "",
                  country: addr.country || "US",
                  phone: addr.phone || ""
                }));
              }
            } catch (e) {
              console.error("Error parsing shipping addresses:", e);
            }

            if (shippingAddresses.length > 0) {
              const defaultAddress = shippingAddresses[0];
              setAddress({
                fullName: defaultAddress.fullName || "",
                addressLine1: defaultAddress.addressLine1 || "",
                addressLine2: defaultAddress.addressLine2 || "",
                city: defaultAddress.city || "",
                state: defaultAddress.state || "",
                zipCode: defaultAddress.zipCode || "",
                country: defaultAddress.country || "US",
                phone: defaultAddress.phone || data.phone || "",
              });
            }
          }
        } catch (error) {
          console.error("Error loading user info:", error);
        }
      };

      loadUserInfo();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!address.fullName || !address.addressLine1 || !address.city || !address.state || !address.zipCode) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in Supabase
      const orderData = {
        user_id: user?.id || null,
        shipping_address: address as any, // Type cast to resolve type issue
        total_amount: subtotal,
        payment_method: paymentMethod,
        payment_status: "pending",
        status: "pending",
      };

      const { data: orderResult, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.items.map((item) => ({
        order_id: orderResult.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart after successful order
      await clearCart();

      // Redirect to order confirmation
      navigate(`/order-confirmation/${orderResult.id}`);

      toast({
        title: "Order placed!",
        description: "Your order has been successfully placed.",
      });
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Error placing order",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Shipping & Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={address.addressLine1}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={address.addressLine2}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={address.country}
                  onValueChange={(value) =>
                    setAddress((prev) => ({ ...prev, country: value }))
                  }
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={address.phone || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="creditCard"
                  checked={paymentMethod === "creditCard"}
                  onChange={() => setPaymentMethod("creditCard")}
                  className="h-4 w-4 text-zyra-purple focus:ring-zyra-purple"
                />
                <Label htmlFor="creditCard" className="cursor-pointer">
                  Credit Card
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="h-4 w-4 text-zyra-purple focus:ring-zyra-purple"
                />
                <Label htmlFor="paypal" className="cursor-pointer">
                  PayPal
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="cashOnDelivery"
                  name="paymentMethod"
                  value="cashOnDelivery"
                  checked={paymentMethod === "cashOnDelivery"}
                  onChange={() => setPaymentMethod("cashOnDelivery")}
                  className="h-4 w-4 text-zyra-purple focus:ring-zyra-purple"
                />
                <Label htmlFor="cashOnDelivery" className="cursor-pointer">
                  Cash on Delivery
                </Label>
              </div>
            </div>

            {paymentMethod === "creditCard" && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">
                  For demonstration purposes, no actual payment will be processed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-1">x{item.quantity}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>Calculated at next step</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
