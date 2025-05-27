
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, CreditCard, Truck, Shield, Star } from "lucide-react";
import ZiinaPayment from "@/components/checkout/ZiinaPayment";

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

  const handlePaymentError = (error: string) => {
    navigate('/order-failed');
  };

  if (!user || items.length === 0) {
    return null;
  }

  const orderData = {
    email: user.email,
    firstName: user.user_metadata?.first_name || '',
    lastName: user.user_metadata?.last_name || '',
    items: items,
    subtotal: subtotal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <Navbar />
      
      <div className="py-12">
        <Container>
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-6 animate-bounce-in shadow-2xl">
              <ShoppingBag className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-4 animate-text-shimmer">
              Secure Checkout
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-in-up" style={{animationDelay: '200ms'}}>
              Complete your purchase with confidence
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Order Summary */}
            <Card className="animate-slide-in-left border-purple-200/50 dark:border-purple-800/50 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-white">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 animate-scale-in hover:shadow-lg transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center">
                        <Star className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{item.name}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                            Qty: {item.quantity}
                          </Badge>
                          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-purple-600 dark:text-purple-400">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Truck className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Secure Payment</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="animate-slide-in-right border-purple-200/50 dark:border-purple-800/50 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-white">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <ZiinaPayment
                  amount={subtotal}
                  orderData={orderData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
