
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OrderSummary from "@/components/checkout/OrderSummary";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import DeliveryOptions from "@/components/checkout/DeliveryOptions";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(10);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState("standard");
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "UAE"
  });

  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checkout.",
        variant: "destructive",
      });
      navigate("/shop");
      return;
    }
  }, [user, items, navigate, toast]);

  const handleShippingInfoChange = (field: string, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeliveryOptionChange = (option: string) => {
    setSelectedDeliveryOption(option);
    setShippingCost(option === "express" ? 25 : 10);
  };

  const validateForm = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
    for (const field of required) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        toast({
          title: "Missing information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const createOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user!.id,
          total_amount: total,
          status: "pending",
          shipping_address: shippingInfo,
          payment_method: selectedPaymentMethod,
          delivery_option: selectedDeliveryOption,
          shipping_cost: shippingCost,
          subtotal: subtotal
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Redirect to success page
      navigate(`/order-success/${order.id}`);

      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      navigate("/order-failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container className="py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AddressForm
                  shippingInfo={shippingInfo}
                  onShippingInfoChange={handleShippingInfoChange}
                />
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
              </CardHeader>
              <CardContent>
                <DeliveryOptions
                  selectedOption={selectedDeliveryOption}
                  onOptionChange={handleDeliveryOptionChange}
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethods
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={setSelectedPaymentMethod}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  total={total}
                />
                
                <Separator className="my-4" />
                
                <Button
                  onClick={createOrder}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? "Processing..." : `Place Order - AED ${total.toFixed(2)}`}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Secure checkout powered by Ziina
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Checkout;
