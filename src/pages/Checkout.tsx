
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { ArrowLeft, CreditCard, Truck, Shield, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import OrderSummary from "@/components/checkout/OrderSummary";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import DeliveryOptions from "@/components/checkout/DeliveryOptions";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [shippingCost, setShippingCost] = useState(10);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("ziina");
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

  if (!user || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10">
        <Navbar />
        <Container className="py-12">
          <div className="text-center animate-fade-in">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      <Navbar />
      <Container className="py-8 relative z-10">
        <div className="mb-6 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 hover:scale-105 transition-transform"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
              Checkout
            </h1>
            <p className="text-xl text-muted-foreground animate-slide-in-right">Complete your purchase securely</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
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
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 animate-slide-in-left" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Delivery Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeliveryOptions
                  selectedOption={selectedDeliveryOption}
                  onOptionChange={handleDeliveryOptionChange}
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <div className="animate-slide-in-left" style={{ animationDelay: '200ms' }}>
              <PaymentMethods
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                shippingInfo={shippingInfo}
                deliveryOption={selectedDeliveryOption}
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4 bg-card/60 backdrop-blur-sm border-border/50 animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  total={total}
                />
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      Secure checkout powered by {selectedPaymentMethod === 'ziina' ? 'Ziina' : 'PayPal'}
                    </div>
                  </div>
                  
                  <div className="text-xs text-center text-muted-foreground bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 p-3 rounded">
                    🔒 Your payment information is encrypted and secure
                  </div>
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
