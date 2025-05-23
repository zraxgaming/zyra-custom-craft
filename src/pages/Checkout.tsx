
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartProvider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ShippingAddress } from "@/types/order";
import AddressForm from "@/components/checkout/AddressForm";
import DeliveryOptions from "@/components/checkout/DeliveryOptions";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import CouponForm from "@/components/checkout/CouponForm";

interface CheckoutFormValues {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  sameShipping: boolean;
  deliveryType: "standard" | "express";
}

const Checkout = () => {
  const navigate = useNavigate();
  const { state, subtotal, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formValues, setFormValues] = useState<CheckoutFormValues>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    sameShipping: true,
    deliveryType: "standard",
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [existingAddresses, setExistingAddresses] = useState<ShippingAddress[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const shipping = formValues.deliveryType === "express" ? 15 : 5;
  const discount = 0;
  const total = subtotal + shipping - discount;

  // Check if address is valid
  const hasValidAddress = formValues.name && formValues.street && formValues.city && 
                         formValues.state && formValues.zipCode && formValues.country;
  
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Login required",
        description: "Please login to continue to checkout",
      });
      navigate("/auth?redirect=/checkout");
      return;
    }
    
    if (state.items.length === 0) {
      navigate("/cart");
    }
  }, [isLoading, user, state.items.length, navigate, toast]);
  
  const handleInputChange = (name: string, value: string | boolean) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddressSelect = (address: ShippingAddress | null) => {
    if (address) {
      setFormValues(prev => ({
        ...prev,
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone || prev.phone,
      }));
    }
  };
  
  const handleApplyCoupon = async (code: string) => {
    toast({
      title: "Coupon feature coming soon",
      description: "Coupon functionality will be available in a future update.",
    });
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode(null);
  };
  
  const placeOrder = async (paymentDetails?: any) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to continue to checkout",
      });
      navigate("/auth?redirect=/checkout");
      return;
    }

    if (!hasValidAddress) {
      toast({
        title: "Invalid address",
        description: "Please complete your shipping address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const shippingAddress: ShippingAddress = {
        name: formValues.name,
        street: formValues.street,
        city: formValues.city,
        state: formValues.state,
        zipCode: formValues.zipCode,
        country: formValues.country,
        phone: formValues.phone,
      };
      
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          status: "pending",
          payment_status: paymentDetails ? "paid" : "pending",
          payment_method: paymentDetails?.transactionId ? "ziina" : "paypal",
          delivery_type: formValues.deliveryType,
          shipping_address: shippingAddress as any
        })
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      const orderItems = state.items.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization || null
      }));
      
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      await clearCart();
      
      if (paymentDetails) {
        navigate(`/order-success/${orderData.id}`);
      } else {
        navigate(`/order-failed/${orderData.id}`);
      }
      
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
      navigate(`/order-failed`);
      setIsProcessing(false);
    }
  };
  
  const onPayPalApprove = async (data: any) => {
    try {
      const paymentDetails = {
        paypal_order_id: data.orderID,
        payment_status: "COMPLETED"
      };
      
      await placeOrder(paymentDetails);
    } catch (error) {
      console.error("PayPal payment error:", error);
      setIsProcessing(false);
      toast({
        title: "Payment failed",
        description: "There was an error processing your PayPal payment",
        variant: "destructive",
      });
    }
  };

  const onZiinaApprove = async (data: any) => {
    try {
      await placeOrder(data);
    } catch (error) {
      console.error("Ziina payment error:", error);
      setIsProcessing(false);
      toast({
        title: "Payment failed",
        description: "There was an error processing your Ziina payment",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-12">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Checkout</h1>
        <Separator className="mb-8" />
        
        {state.items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Truck className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-medium mb-2 text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Add items to your cart before proceeding to checkout.
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate("/shop")}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form>
                <div className="bg-card p-6 rounded-lg shadow-sm mb-6 border">
                  <h2 className="text-xl font-medium mb-6 flex items-center text-foreground">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Information
                  </h2>
                  
                  <AddressForm 
                    existingAddresses={existingAddresses}
                    formValues={formValues}
                    userEmail={user.email || ""}
                    onChange={handleInputChange}
                    onAddressSelect={handleAddressSelect}
                  />
                  
                  <DeliveryOptions
                    selectedOption={formValues.deliveryType}
                    onOptionChange={(value) => handleInputChange("deliveryType", value)}
                  />
                </div>
                
                <div className="bg-card p-6 rounded-lg shadow-sm border">
                  <PaymentMethods
                    onPayPalApprove={onPayPalApprove}
                    onZiinaApprove={onZiinaApprove}
                    isProcessing={isProcessing}
                    total={total}
                    hasValidAddress={hasValidAddress}
                  />
                </div>
              </form>
            </div>
            
            <div>
              <div className="space-y-6">
                <OrderSummary
                  items={state.items}
                  subtotal={subtotal}
                  shipping={shipping}
                  discount={discount}
                  couponCode={appliedCoupon?.code}
                />
                
                <div className="bg-card p-6 rounded-lg shadow-sm border">
                  <CouponForm
                    onApplyCoupon={handleApplyCoupon}
                    isLoading={isApplyingCoupon}
                    appliedCoupon={null}
                    onRemoveCoupon={handleRemoveCoupon}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default Checkout;
