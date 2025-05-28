
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { AlertCircle, RefreshCw, ShoppingCart, Home, Mail, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const OrderFailed = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead 
        title="Payment Failed - Zyra"
        description="Your payment could not be processed. Please try again or contact our support team for assistance."
        url="https://shopzyra.vercel.app/order-failed"
      />
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900/20">
        <Navbar />
        
        <Container className="py-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8 animate-bounce-in">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-2xl animate-pulse">
                <AlertCircle className="h-16 w-16 text-white animate-wiggle" />
              </div>
            </div>

            {/* Error Message */}
            <Card className="mb-8 animate-scale-in border-red-200/50 dark:border-red-800/50 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50">
                <CardTitle className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Payment Failed
                </CardTitle>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  We couldn't process your payment at this time
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">
                      What happened?
                    </h3>
                    <ul className="text-red-700 dark:text-red-400 space-y-2 text-left">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Payment was declined by your bank or card issuer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Insufficient funds or credit limit reached</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Technical issue with the payment processor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Incorrect payment information entered</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                      What can you do?
                    </h3>
                    <ul className="text-blue-700 dark:text-blue-400 space-y-2 text-left">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Try a different payment method or card</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Check your card details and billing address</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Contact your bank to authorize the transaction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Contact our support team for assistance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Button 
                onClick={() => navigate('/checkout')}
                className="h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-in-left"
              >
                <RefreshCw className="h-6 w-6 mr-3" />
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/cart')}
                className="h-14 border-2 border-purple-300 hover:border-purple-500 text-purple-600 hover:text-purple-700 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-in-right"
              >
                <ShoppingCart className="h-6 w-6 mr-3" />
                View Cart
              </Button>
            </div>

            {/* Support Section */}
            <Card className="animate-fade-in border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Our support team is here to help you complete your purchase
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                  <a href="tel:+971412345678">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Us
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="mt-8 animate-fade-in" style={{animationDelay: '0.5s'}}>
              <Link to="/shop">
                <Button variant="ghost" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                  <Home className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </Container>
        
        <Footer />
      </div>
    </>
  );
};

// Fallback minimal error UI (in case main UI fails)
export function OrderFailedFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff0f0' }}>
      <h1 style={{ color: '#d32f2f', fontSize: '2rem', marginBottom: '1rem' }}>Order Failed</h1>
      <p style={{ color: '#555', fontSize: '1.2rem' }}>Sorry, your payment or order could not be completed.</p>
      <a href="/checkout" style={{ marginTop: '2rem', color: '#fff', background: '#d32f2f', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Try Again</a>
    </div>
  );
}

export default OrderFailed;
