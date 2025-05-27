
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Shield, CheckCircle } from "lucide-react";
import SimpleCheckoutForm from "@/components/checkout/SimpleCheckoutForm";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <Navbar />
      
      <div className="py-12">
        <Container>
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-8 animate-bounce-in shadow-2xl">
              <ShoppingBag className="h-12 w-12 text-white animate-pulse" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6 animate-text-shimmer">
              Secure Checkout
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-in-up max-w-2xl mx-auto" style={{animationDelay: '200ms'}}>
              Complete your purchase with confidence using our premium payment experience
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 animate-fade-in" style={{animationDelay: '400ms'}}>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Secure Payment</span>
              </div>
            </div>
          </div>
          
          <SimpleCheckoutForm
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
