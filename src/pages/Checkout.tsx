
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    navigate(`/order-success/${orderId}`);
  };

  if (!user || (items.length === 0 && !isLoading)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <SEOHead 
        title="Checkout - Zyra Custom Craft"
        description="Complete your purchase securely at Zyra Custom Craft. We accept multiple payment methods and offer secure checkout."
      />
      <Navbar />
      
      <div className="py-12">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Secure Checkout
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete your purchase safely and securely
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm
                subtotal={subtotal}
                items={items}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>

            {/* Sidebar with Coupons and Gift Cards */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Discounts & Credits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              {/* Order Items Summary */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Order Items ({items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <img
                          src={item.image_url || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × AED {item.price?.toFixed(2)}
                          </p>
                          {item.customization && (
                            <p className="text-xs text-primary">✨ Customized</p>
                          )}
                        </div>
                        <div className="text-sm font-medium">
                          AED {((item.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
