
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import SEOHead from "@/components/seo/SEOHead";

const Checkout = () => {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
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
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Checkout - Zyra Custom Craft"
        description="Complete your purchase securely at Zyra Custom Craft. We accept multiple payment methods and offer secure checkout."
      />
      <Navbar />
      
      <div className="py-12">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Checkout</h1>
            <p className="text-lg text-muted-foreground">
              Complete your purchase securely
            </p>
          </div>
          
          <CheckoutForm
            items={items}
            subtotal={subtotal}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
