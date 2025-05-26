
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw, AlertTriangle, HelpCircle, CreditCard, Phone } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 relative overflow-hidden particle-field-bg mesh-gradient-bg">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-red-400 to-orange-500 rounded-full blur-3xl animate-float-gentle"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl animate-particle-float"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-300 to-red-400 rounded-full blur-3xl animate-morphing-gradient opacity-15"></div>
        </div>

        <Container>
          <div className="max-w-4xl mx-auto relative z-10">
            {/* Error Header */}
            <Card className="text-center animate-scale-in mb-8 card-premium border-gradient hover-3d-lift">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 animate-aurora">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 animate-bounce-in shadow-2xl hover-neon-glow">
                  <XCircle className="h-12 w-12 text-red-600 animate-elastic-scale" />
                </div>
                <CardTitle className="text-4xl text-red-600 mb-4 animate-fade-in animate-text-shimmer">
                  😞 Payment Failed
                </CardTitle>
                <p className="text-xl text-muted-foreground animate-slide-in-up">
                  Unfortunately, we couldn't process your payment. Don't worry, we can help you fix this!
                </p>
              </CardHeader>
            </Card>

            {/* Error Details */}
            <Card className="animate-slide-in-left mb-8 card-premium hover-3d-lift">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 animate-morphing-gradient">
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-6 w-6 animate-bounce" />
                  What Went Wrong?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-700 mb-4 animate-slide-in-up">Common Issues:</h4>
                    <div className="space-y-3">
                      {[
                        "Insufficient funds in your account",
                        "Expired or invalid card details", 
                        "Bank security restrictions",
                        "Network connection issues",
                        "Payment gateway timeout"
                      ].map((issue, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg animate-slide-in-right hover-magnetic" style={{animationDelay: `${index * 0.1}s`}}>
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-red-600">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-700 mb-4 animate-slide-in-up" style={{animationDelay: '0.2s'}}>Quick Solutions:</h4>
                    <div className="space-y-3">
                      {[
                        "Check your card details and expiry date",
                        "Try a different payment method",
                        "Contact your bank to authorize the payment",
                        "Refresh and try again",
                        "Use a different browser or device"
                      ].map((solution, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg animate-slide-in-left hover-magnetic" style={{animationDelay: `${(index + 5) * 0.1}s`}}>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-green-600">{solution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="animate-slide-in-up mb-8 card-premium hover-3d-lift">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 animate-aurora">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <CreditCard className="h-6 w-6 animate-float-gentle" />
                  Try Different Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 animate-scale-in hover-3d-lift">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-blue-700">PayPal</h4>
                    </div>
                    <p className="text-sm text-blue-600 mb-4">
                      Secure online payment with your PayPal account or card
                    </p>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 animate-bounce" onClick={() => navigate('/checkout')}>
                      Try PayPal
                    </Button>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 animate-scale-in hover-3d-lift" style={{animationDelay: '0.2s'}}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-purple-700">Ziina</h4>
                    </div>
                    <p className="text-sm text-purple-600 mb-4">
                      Digital payment solution for UAE customers
                    </p>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 animate-bounce" onClick={() => navigate('/checkout')}>
                      Try Ziina
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in">
              <Button
                onClick={() => navigate('/checkout')}
                className="btn-premium hover-ripple animate-elastic-scale"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Payment Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/shop')}
                className="hover-3d-lift animate-pulse"
                size="lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </div>

            {/* Support Section */}
            <Card className="animate-slide-in-up card-premium hover-3d-lift">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 animate-aurora">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <HelpCircle className="h-6 w-6 animate-bounce" />
                  Still Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <p className="text-muted-foreground text-lg animate-fade-in">
                    Our support team is ready to assist you with payment issues
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-xl border shadow-lg animate-scale-in hover-3d-lift">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HelpCircle className="h-6 w-6 text-blue-600 animate-bounce" />
                      </div>
                      <h4 className="font-semibold text-blue-600 mb-2">📧 Email Support</h4>
                      <p className="text-sm text-muted-foreground mb-2">support@shopzyra.com</p>
                      <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                    </div>
                    
                    <div className="p-6 bg-white rounded-xl border shadow-lg animate-scale-in hover-3d-lift" style={{animationDelay: '0.2s'}}>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="h-6 w-6 text-green-600 animate-bounce" />
                      </div>
                      <h4 className="font-semibold text-green-600 mb-2">💬 Live Chat</h4>
                      <p className="text-sm text-muted-foreground mb-2">Available 9 AM - 6 PM</p>
                      <p className="text-xs text-muted-foreground">Monday to Friday</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl animate-fade-in hover-magnetic">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-yellow-800 font-medium">
                        💡 <strong>Good News:</strong> Your cart items are saved!
                      </p>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm text-yellow-700">
                      You can return anytime to complete your purchase with a different payment method.
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
