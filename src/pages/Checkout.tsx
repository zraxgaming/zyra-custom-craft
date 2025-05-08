
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartProvider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ShippingAddress, Coupon } from "@/types/order";
import AddressForm from "@/components/checkout/AddressForm";
import DeliveryOptions from "@/components/checkout/DeliveryOptions";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import CouponForm from "@/components/checkout/CouponForm";

// Define the form values interface
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
  paymentMethod: "credit_card" | "paypal";
}

const Checkout = () => {
  const navigate = useNavigate();
  const { state, subtotal, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Form state
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
    paymentMethod: "credit_card",
  });
  
  // Additional state
  const [isProcessing, setIsProcessing] = useState(false);
  const [existingAddresses, setExistingAddresses] = useState<ShippingAddress[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Calculate total with shipping and discount
  const shipping = formValues.deliveryType === "express" ? 15 : 5;
  const discount = appliedCoupon ? 
    (appliedCoupon.discount_type === 'percentage' 
      ? (subtotal * appliedCoupon.discount_value / 100) 
      : appliedCoupon.discount_value) : 0;
  const total = subtotal + shipping - discount;
  
  // Check for user and redirect if no items in cart
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
  
  // Fetch user's saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("shipping_addresses")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        if (data.shipping_addresses && data.shipping_addresses.length > 0) {
          setExistingAddresses(data.shipping_addresses as unknown as ShippingAddress[]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    
    fetchAddresses();
  }, [user]);
  
  // Update form values
  const handleInputChange = (name: string, value: string | boolean) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle address selection
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
  
  // Apply coupon code
  const handleApplyCoupon = async (code: string) => {
    if (!user) return;
    
    try {
      setIsApplyingCoupon(true);
      setCouponCode(code);
      
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .eq("active", true)
        .single();
      
      if (error) {
        toast({
          title: "Invalid coupon",
          description: "The coupon code you entered is invalid or expired.",
          variant: "destructive",
        });
        setCouponCode(null);
        return;
      }
      
      // Validate coupon requirements
      const now = new Date();
      const expiryDate = data.expires_at ? new Date(data.expires_at) : null;
      const startDate = new Date(data.starts_at);
      
      if (startDate > now || (expiryDate && expiryDate < now)) {
        toast({
          title: "Expired coupon",
          description: "This coupon is not valid for the current date.",
          variant: "destructive",
        });
        setCouponCode(null);
        return;
      }
      
      if (data.max_uses && data.used_count >= data.max_uses) {
        toast({
          title: "Coupon limit reached",
          description: "This coupon has reached its usage limit.",
          variant: "destructive",
        });
        setCouponCode(null);
        return;
      }
      
      if (data.min_purchase && subtotal < data.min_purchase) {
        toast({
          title: "Minimum purchase not met",
          description: `This coupon requires a minimum purchase of $${data.min_purchase}.`,
          variant: "destructive",
        });
        setCouponCode(null);
        return;
      }
      
      // Apply the valid coupon
      setAppliedCoupon(data as Coupon);
      toast({
        title: "Coupon applied",
        description: "The discount has been applied to your order.",
      });
      
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast({
        title: "Error",
        description: "There was a problem applying your coupon.",
        variant: "destructive",
      });
      setCouponCode(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  
  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode(null);
  };
  
  // Place order function
  const placeOrder = async (paymentDetails?: any) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to continue to checkout",
      });
      navigate("/auth?redirect=/checkout");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create shipping address object
      const shippingAddress: ShippingAddress = {
        name: formValues.name,
        street: formValues.street,
        city: formValues.city,
        state: formValues.state,
        zipCode: formValues.zipCode,
        country: formValues.country,
        phone: formValues.phone,
      };
      
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          status: "pending",
          payment_status: paymentDetails ? "paid" : "pending",
          payment_method: formValues.paymentMethod,
          delivery_type: formValues.deliveryType,
          shipping_address: shippingAddress as any
        })
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      // Create order items
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
      
      // Update coupon usage if applied
      if (appliedCoupon) {
        await supabase
          .from("coupons")
          .update({ used_count: appliedCoupon.used_count + 1 })
          .eq("id", appliedCoupon.id);
      }
      
      // Save address if it's new
      if (!existingAddresses.some(addr => 
        addr.street === shippingAddress.street && 
        addr.zipCode === shippingAddress.zipCode
      )) {
        try {
          await supabase.rpc('add_shipping_address', {
            user_id: user.id,
            address: shippingAddress as any
          });
        } catch (error) {
          console.error("Error saving address:", error);
          // Non-critical error, can continue
        }
      }
      
      // Send order confirmation email
      try {
        // Get user profile info for the email
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, email: id")
          .eq("id", user.id)
          .single();
        
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            order_id: orderData.id,
            customer_email: profile?.email || user.email,
            status: "pending",
            customer_name: profile?.display_name || formValues.name
          })
        });
      } catch (error) {
        console.error("Error sending confirmation email:", error);
        // Non-critical error, can continue
      }
      
      // Clear cart and redirect to confirmation
      await clearCart();
      navigate(`/order-confirmation/${orderData.id}`);
      
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  // Handle form submission (for credit card)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For credit card, just place the order
    // In a real app, this would integrate with a payment processor
    if (formValues.paymentMethod === "credit_card") {
      placeOrder();
    }
  };
  
  // PayPal approval handler
  const onPayPalApprove = async (data: any) => {
    try {
      // In a real app, you would verify the payment with PayPal here
      const paymentDetails = {
        paypal_order_id: data.orderID,
        payment_status: "COMPLETED"
      };
      
      // Place the order with payment details
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
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="mb-8">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase by providing shipping and payment details</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-medium mb-6 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </h2>
                
                <AddressForm 
                  existingAddresses={existingAddresses}
                  formValues={formValues}
                  userEmail={user.email}
                  onChange={handleInputChange}
                  onAddressSelect={handleAddressSelect}
                />
                
                <DeliveryOptions
                  selectedOption={formValues.deliveryType}
                  onOptionChange={(value) => handleInputChange("deliveryType", value)}
                />
              </div>
              
              {/* Payment Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-medium mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>
                
                <PaymentMethods
                  selectedMethod={formValues.paymentMethod}
                  onMethodChange={(value) => handleInputChange("paymentMethod", value)}
                  onPayPalApprove={onPayPalApprove}
                  isProcessing={isProcessing}
                  total={total}
                  onCompleteOrder={() => placeOrder()}
                />
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="space-y-6">
              <OrderSummary
                items={state.items}
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                couponCode={appliedCoupon?.code}
              />
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <CouponForm
                  onApplyCoupon={handleApplyCoupon}
                  isLoading={isApplyingCoupon}
                  appliedCoupon={appliedCoupon ? {
                    code: appliedCoupon.code,
                    discountValue: appliedCoupon.discount_value,
                    discountType: appliedCoupon.discount_type as 'percentage' | 'fixed'
                  } : null}
                  onRemoveCoupon={handleRemoveCoupon}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Checkout;
