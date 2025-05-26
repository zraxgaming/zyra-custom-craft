
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw, AlertTriangle, HelpCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const OrderFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any pending payment data
    localStorage.removeItem('pending_payment');
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-red-400 to-orange-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        <Container>
          <div className="max-w-3xl mx-auto relative z-10">
            {/* Error Header */}
            <Card className="text-center animate-scale-in mb-8 bg-white/80 backdrop-blur-sm border-red-200">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg">
                  <XCircle className="h-10 w-10 text-red-600 animate-pulse" />
                </div>
                <CardTitle className="text-3xl text-red-600 mb-2 animate-fade-in">😞 Payment Failed</CardTitle>
                <p className="text-lg text-muted-foreground animate-slide-in-up">
                  Unfortunately, we couldn't process your payment. Don't worry, we can help you fix this!
                </p>
              </CardHeader>
            </Card>

            {/* Error Details */}
            <Card className="animate-slide-in-left mb-8 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5 animate-bounce" />
                  What Went Wrong?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-700">Common Issues:</h4>
                    <ul className="space-y-2 text-sm text-red-600">
                      <li className="flex items-center gap-2 animate-slide-in-right" style={{animationDelay: '0.1s'}}>
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        Insufficient funds in your account
                      </li>
                      <li className="flex items-center gap-2 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        Expired or invalid card details
                      </li>
                      <li className="flex items-center gap-2 animate-slide-in-right" style={{animationDelay: '0.3s'}}>
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        Bank security restrictions
                      </li>
                      <li className="flex items-center gap-2 animate-slide-in-right" style={{animationDelay: '0.4s'}}>
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        Network connection issues
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-700">Quick Solutions:</h4>
                    <ul className="space-y-2 text-sm text-green-600">
                      <li className="flex items-center gap-2 animate-slide-in-left" style={{animationDelay: '0.1s'}}>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Check your card details and expiry date
                      </li>
                      <li className="flex items-center gap-2 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Try a different payment method
                      </li>
                      <li className="flex items-center gap-2 animate-slide-in-left" style={{animationDelay: '0.3s'}}>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Contact your bank to authorize the payment
                      </li>
                      <li className="flex items-center gap-2 animate-slide-in-left" style={{animationDelay: '0.4s'}}>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Refresh and try again
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in">
              <Button
                onClick={() => navigate('/checkout')}
                className="animate-bounce bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Payment Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/shop')}
                className="animate-pulse hover:scale-105 transition-transform duration-300"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>

            {/* Support Section */}
            <Card className="animate-slide-in-up bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <HelpCircle className="h-5 w-5 animate-bounce" />
                  Still Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Our support team is ready to assist you with payment issues
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-lg border animate-scale-in" style={{animationDelay: '0.2s'}}>
                      <h4 className="font-semibold text-blue-600 mb-2">📧 Email Support</h4>
                      <p className="text-sm text-muted-foreground">support@shopzyra.com</p>
                      <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border animate-scale-in" style={{animationDelay: '0.4s'}}>
                      <h4 className="font-semibold text-green-600 mb-2">💬 Live Chat</h4>
                      <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM</p>
                      <p className="text-xs text-muted-foreground mt-1">Monday to Friday</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-fade-in">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Tip:</strong> Your cart items are saved! You can return anytime to complete your purchase.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default OrderFailed;
