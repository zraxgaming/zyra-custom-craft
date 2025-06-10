import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { AlertCircle, RefreshCw, ShoppingCart, Home, Mail, Phone, Sparkles, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const OrderFailed = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead 
        title="Payment Failed - Zyra Custom Craft"
        description="Your payment could not be processed. Please try again or contact our support team for assistance."
        url="https://shopzyra.vercel.app/order-failed"
        keywords="payment failed, error, checkout, zyra, custom craft"
      />
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20 animate-fade-in">
        <Navbar />
        
        <Container className="py-20">
          <div className="max-w-4xl mx-auto text-center animate-scale-in">
            {/* Animated Error Icon */}
            <div className="mb-12 relative animate-bounce-in">
              <div className="absolute inset-0 opacity-20 animate-pulse">
                <div className="w-40 h-40 bg-gradient-to-r from-red-400 to-orange-400 blur-3xl mx-auto"></div>
              </div>
              <div className="relative inline-flex items-center justify-center w-40 h-40 bg-gradient-to-br from-red-500 via-red-600 to-orange-500 rounded-full shadow-2xl animate-wiggle">
                <AlertCircle className="h-20 w-20 text-white animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-white/20 animate-shimmer"></div>
              </div>
              <div className="absolute -top-4 -right-4 animate-bounce">
                <Zap className="h-8 w-8 text-orange-400" />
              </div>
              <div className="absolute -bottom-4 -left-4 animate-bounce" style={{animationDelay: '0.2s'}}>
                <Sparkles className="h-6 w-6 text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <Card className="mb-12 animate-slide-in-up border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-50 via-orange-50 to-pink-50 dark:from-red-950/50 dark:via-orange-950/50 dark:to-pink-950/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 via-transparent to-orange-100/50 animate-shimmer"></div>
                <CardTitle className="relative text-5xl font-bold text-red-600 dark:text-red-400 mb-4 animate-text-glow">
                  Payment Failed
                </CardTitle>
                <p className="relative text-2xl text-gray-600 dark:text-gray-400 animate-fade-in">
                  We couldn't process your payment at this time
                </p>
              </CardHeader>
              <CardContent className="p-12">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 animate-slide-in-left">
                    <h3 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-6 flex items-center">
                      <AlertCircle className="h-6 w-6 mr-3 animate-pulse" />
                      What happened?
                    </h3>
                    <ul className="text-red-700 dark:text-red-400 space-y-4 text-left">
                      <li className="flex items-start gap-3 animate-fade-in">
                        <span className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></span>
                        <span className="text-lg">Payment was declined by your bank or card issuer</span>
                      </li>
                      <li className="flex items-start gap-3 animate-fade-in" style={{animationDelay: '0.1s'}}>
                        <span className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></span>
                        <span className="text-lg">Insufficient funds or credit limit reached</span>
                      </li>
                      <li className="flex items-start gap-3 animate-fade-in" style={{animationDelay: '0.2s'}}>
                        <span className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></span>
                        <span className="text-lg">Technical issue with the payment processor</span>
                      </li>
                      <li className="flex items-start gap-3 animate-fade-in" style={{animationDelay: '0.3s'}}>
                        <span className="w-3 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></span>
                        <span className="text-lg">Incorrect payment information entered</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8 animate-slide-in-right">
                    <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-6 flex items-center">
                      <Sparkles className="h-6 w-6 mr-3 animate-spin" />
                      What can you do?
                    </h3>
                    <ul className="text-blue-700 dark:text-blue-400 space-y-4 text-left">
                      <li className="flex items-start gap-3 animate-fade-in">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mt-2 animate-pulse"></span>
                        <span className="text-lg">Try a different payment method or card</span>
                      </li>
                      <li className="flex items-start gap-3 animate-fade-in" style={{animationDelay: '0.1s'}}>
                        <span className="w-3 h-3 bg-blue-500 rounded-full mt-2 animate-pulse"></span>
                        <span className="text-lg">Check your card details and billing address</span>
                      </li>
                      <li className="flex items-start gap-3 animate-fade-in" style={{animationDelay: '0.2s'}}>
                        <span className="w-3 h-3 bg-blue-500 rounded-full mt-2 animate-pulse"></span>
                        <span className="text-lg">Contact your bank to authorize the transaction</span>
                      </li>
                      <li className="flex items-start gap-3 animate-fade-in" style={{animationDelay: '0.3s'}}>
                        <span className="w-3 h-3 bg-blue-500 rounded-full mt-2 animate-pulse"></span>
                        <span className="text-lg">Contact our support team for assistance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <Button 
                onClick={() => navigate('/checkout')}
                className="group relative h-16 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-in-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                <RefreshCw className="h-8 w-8 mr-4 group-hover:animate-spin" />
                Try Again
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/cart')}
                className="group h-16 border-2 border-purple-300 hover:border-purple-500 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-slide-in-right"
              >
                <ShoppingCart className="h-8 w-8 mr-4 group-hover:animate-bounce" />
                View Cart
              </Button>
            </div>

            {/* Support Section */}
            <Card className="animate-fade-in border-0 bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 backdrop-blur-sm shadow-xl">
              <CardContent className="p-10">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 animate-text-glow">
                  Need Help?
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 animate-fade-in">
                  Our support team is here to help you complete your purchase
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/contact">
                    <Button variant="outline" className="group h-14 px-8 text-lg font-semibold hover:scale-105 transition-all duration-300 animate-bounce">
                      <Mail className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                      Contact Support
                    </Button>
                  </Link>
                  <a href="tel:+971412345678">
                    <Button variant="outline" className="group h-14 px-8 text-lg font-semibold hover:scale-105 transition-all duration-300 animate-bounce" style={{animationDelay: '0.1s'}}>
                      <Phone className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                      Call Us
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="mt-12 animate-fade-in" style={{animationDelay: '0.8s'}}>
              <Link to="/shop">
                <Button variant="ghost" className="group text-xl text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-all duration-300 hover:scale-110">
                  <Home className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-red-200/20 dark:bg-red-700/20 rounded-full animate-float"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 bg-orange-200/20 dark:bg-orange-700/20 rounded-full animate-float-reverse"></div>
          </div>
        </Container>
        
        <Footer />
      </div>
    </>
  );
};

export default OrderFailed;
