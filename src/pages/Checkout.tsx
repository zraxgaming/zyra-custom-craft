
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
import { ShoppingBag, CreditCard, Truck, Shield, Star, Sparkles, Gift, CheckCircle } from "lucide-react";
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Order Summary */}
            <Card className="animate-slide-in-left border-purple-200/50 dark:border-purple-800/50 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-purple-950/50 dark:via-gray-800 dark:to-pink-950/50 border-b border-purple-200/30 dark:border-purple-800/30">
                <CardTitle className="flex items-center gap-4 text-3xl text-gray-900 dark:text-white">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  Order Summary
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-purple-50/30 dark:from-gray-800/50 dark:to-purple-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in hover:shadow-lg transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 via-white to-pink-100 dark:from-purple-900/50 dark:via-gray-800 dark:to-pink-900/50 rounded-xl flex items-center justify-center shadow-md">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Star className="h-10 w-10 text-purple-600 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{item.name}</h3>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 font-medium">
                            Qty: {item.quantity}
                          </Badge>
                          {item.customization && Object.keys(item.customization).length > 0 && (
                            <Badge variant="outline" className="border-pink-200 text-pink-700 dark:border-pink-800 dark:text-pink-300">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Customized
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator className="my-8 bg-gradient-to-r from-transparent via-purple-200 to-transparent dark:via-purple-800" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Truck className="h-5 w-5" />
                        Shipping:
                      </span>
                      <span className="font-semibold text-green-600 flex items-center gap-2">
                        <Gift className="h-4 w-4" />
                        Free
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">$0.00</span>
                    </div>
                    <Separator className="bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-purple-700" />
                    <div className="flex justify-between items-center text-3xl font-bold p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-xl">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-purple-600 dark:text-purple-400">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300">
                      <Truck className="h-6 w-6 text-green-600 animate-float" />
                      <div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400 block">Free Shipping</span>
                        <span className="text-xs text-green-600 dark:text-green-500">Worldwide delivery</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-300">
                      <Shield className="h-6 w-6 text-blue-600 animate-float" style={{animationDelay: '1s'}}>
                      </Shield>
                      <div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400 block">Secure Payment</span>
                        <span className="text-xs text-blue-600 dark:text-blue-500">256-bit encryption</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="animate-slide-in-right border-purple-200/50 dark:border-purple-800/50 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-purple-950/50 dark:via-gray-800 dark:to-pink-950/50 border-b border-purple-200/30 dark:border-purple-800/30">
                <CardTitle className="flex items-center gap-4 text-3xl text-gray-900 dark:text-white">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  Payment Method
                  <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300">
                    Secure & Fast
                  </Badge>
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
