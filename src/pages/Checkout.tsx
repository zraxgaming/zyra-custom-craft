
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import EnhancedCheckoutForm from "@/components/checkout/EnhancedCheckoutForm";

const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      navigate('/shop');
      return;
    }
  }, [user, items, navigate]);

  const handlePaymentSuccess = (orderId: string) => {
    clearCart();
    navigate(`/order-success/${orderId}`);
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12 floating-dots-bg mesh-gradient-bg">
        <Container>
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Checkout
            </h1>
            <p className="text-muted-foreground text-lg">Review your order and complete your purchase</p>
          </div>
          
          <EnhancedCheckoutForm 
            items={items}
            subtotal={subtotal}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
