
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CouponForm from "@/components/checkout/CouponForm";
import GiftCardForm from "@/components/checkout/GiftCardForm";
import SEOHead from "@/components/seo/SEOHead";

const Checkout = () => {
  const { user } = useAuth();
  const {
    items,
    isLoading,
    subtotal,
    discount,
    giftCardAmount,
    setCoupon,
    setGiftCard,
    coupon,
    giftCard,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
      return;
    }
    if (!isLoading && items.length === 0) {
      navigate('/shop');
      return;
    }
  }, [user, items, isLoading, navigate]);

  const handlePaymentSuccess = (orderId: string) => {
    // clearCart will be triggered in the component after payment success
    navigate(`/order-success/${orderId}`);
  };

  if (!user || (items.length === 0 && !isLoading)) {
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
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
              <CheckoutForm
                subtotal={subtotal}
                items={items}
                onPaymentSuccess={handlePaymentSuccess}
                deliveryOptions={[
                  { label: "Home Delivery", value: "delivery" },
                  { label: "Store Pickup", value: "pickup" },
                ]}
                paymentMethods={[
                  { label: "Credit Card", value: "card" },
                  { label: "Cash on Pickup", value: "cash" },
                ]}
              />
            </div>
            <div className="md:col-span-1 space-y-4">
              <CouponForm
                onCouponApply={setCoupon}
                onCouponRemove={() => setCoupon(null)}
                appliedCoupon={coupon}
                orderTotal={subtotal}
              />
              <GiftCardForm
                onGiftCardApply={setGiftCard}
                onGiftCardRemove={() => setGiftCard(null)}
                appliedGiftCard={giftCard}
                orderTotal={subtotal - discount}
              />
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
