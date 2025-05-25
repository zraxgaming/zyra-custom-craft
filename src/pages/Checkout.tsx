import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import OrderSummary from "@/components/checkout/OrderSummary";
import DeliveryOptions from "@/components/checkout/DeliveryOptions";
import CouponForm from "@/components/checkout/CouponForm";
import { ShippingAddress } from "@/types/order";

const Checkout = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { state: cartState, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "UAE",
    phone: ""
  });
  
  const [deliveryType, setDeliveryType] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState(15);

  useEffect(() => {
    if (cartState.items.length === 0 && !authLoading) {
      navigate("/cart");
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
    }
  }, [cartState.items, authLoading, navigate, toast]);

  const subtotal = cartState.items.reduce((total, item) => {
    // Safe access to price with proper fallback
    const itemPrice = item.product?.price || item.price || 0;
    return total + (itemPrice * item.quantity);
  }, 0);
  
  const discount = appliedCoupon 
    ? appliedCoupon.discount_type === 'percentage' 
      ? (subtotal * appliedCoupon.discount_value) / 100
      : appliedCoupon.discount_value
    : 0;
  const total = subtotal - discount + shippingCost;

  const validateAddress = () => {
    return shippingAddress.name && 
           shippingAddress.street && 
           shippingAddress.city && 
           shippingAddress.state && 
           shippingAddress.zipCode && 
           shippingAddress.country;
  };

  const hasValidAddress = validateAddress();

  const createOrder = async (paymentData: any) => {
    try {
      setIsProcessing(true);

      if (!hasValidAddress) {
        throw new Error("Please complete your shipping address");
      }

      // Create order in database
      const orderData = {
        user_id: user?.id || null,
        total_amount: total,
        currency: "AED",
        status: "pending" as const,
        payment_status: "pending" as const,
        payment_method: paymentData.method,
        delivery_type: deliveryType,
        shipping_address: shippingAddress as any,
        billing_address: shippingAddress as any
      };

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartState.items.map(item => ({
        order_id: order.id,
        product_id: item.product?.id || item.productId,
        quantity: item.quantity,
        price: item.product?.price || item.price || 0,
        customization: item.customization
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update order payment status if payment was successful
      if (paymentData.status === "completed") {
        const { error: updateError } = await supabase
          .from("orders")
          .update({ 
            payment_status: "paid" as const,
            status: "processing" as const
          })
          .eq("id", order.id);

        if (updateError) throw updateError;
      }

      // Clear cart
      clearCart();

      // Navigate to success page
      navigate(`/order-success/${order.id}`);

    } catch (error: any) {
      console.error("Order creation error:", error);
      toast({
        title: "Order failed",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
      
      navigate("/order-failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalApprove = async (data: any) => {
    await createOrder({
      method: "paypal",
      status: "completed",
      transactionId: data.orderID,
      amount: total,
      currency: "AED"
    });
  };

  const handleZiinaApprove = async (data: any) => {
    await createOrder({
      method: "ziina",
      status: "completed",
      transactionId: data.transactionId,
      amount: total,
      currency: "AED"
    });
  };

  const handleDeliveryChange = (type: string, cost: number) => {
    setDeliveryType(type);
    setShippingCost(cost);
  };

  const handleCouponApply = (coupon: any) => {
    setAppliedCoupon(coupon);
    toast({
      title: "Coupon applied",
      description: `${coupon.code} has been applied to your order.`,
    });
  };

  const handleCouponRemove = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your order.",
    });
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <AddressForm 
                    address={shippingAddress}
                    onAddressChange={setShippingAddress}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Delivery Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <DeliveryOptions
                    selectedType={deliveryType}
                    onDeliveryChange={handleDeliveryChange}
                  />
                </CardContent>
              </Card>

              <PaymentMethods
                onPayPalApprove={handlePayPalApprove}
                onZiinaApprove={handleZiinaApprove}
                isProcessing={isProcessing}
                total={total}
                hasValidAddress={Boolean(hasValidAddress)}
              />
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderSummary
                    items={cartState.items}
                    subtotal={subtotal}
                    discount={discount}
                    shipping={shippingCost}
                    total={total}
                    appliedCoupon={appliedCoupon}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Promo Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <CouponForm
                    onCouponApply={handleCouponApply}
                    onCouponRemove={handleCouponRemove}
                    appliedCoupon={appliedCoupon}
                    orderTotal={subtotal}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Checkout;
