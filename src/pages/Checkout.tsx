
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import SEOHead from "@/components/seo/SEOHead"; // Assuming default export

const Checkout = () => {
  const { user } = useAuth();
  const { items, clearCart } = useCart(); // subtotal removed, will be from useCart in CheckoutForm
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
      return;
    }

    // It's possible items might be an empty array briefly while loading
    // This check could be deferred or made more robust if items load async for logged-in users
    if (items.length === 0 && !useCart().loading) { 
      navigate('/shop');
      return;
    }
  }, [user, items, navigate, useCart().loading]);

  const handlePaymentSuccess = (orderId: string) => {
    clearCart(); // This should also clear coupon/gift card from context if applicable
    navigate(`/order-success/${orderId}`);
  };

  // Render a loader or minimal UI if user or items are not ready
  if (!user || (items.length === 0 && !useCart().loading) ) {
    // You might want a loading spinner here if useCart().loading is true
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
            onPaymentSuccess={handlePaymentSuccess} // Pass only this prop
          />
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;

