
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
    localStorage.removeItem('pending_payment');
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20 py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Error Header */}
            <Card className="text-center animate-scale-in mb-8 border-red-200 dark:border-red-800 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
                  <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-4xl text-red-600 dark:text-red-400 mb-4">
                  Payment Failed
                </CardTitle>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Unfortunately, we couldn't process your payment. Don't worry, we can help you fix this!
                </p>
              </CardHeader>
            </Card>

            {/* Error Details */}
            <Card className="animate-slide-in-left mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <AlertTriangle className="h-6 w-6" />
                  What Went Wrong?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-4">Common Issues:</h4>
                    <div className="space-y-3">
                      {[
                        "Insufficient funds in your account",
                        "Expired or invalid card details", 
                        "Bank security restrictions",
                        "Network connection issues",
                        "Payment gateway timeout"
                      ].map((issue, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-sm text-red-600 dark:text-red-400">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-4">Quick Solutions:</h4>
                    <div className="space-y-3">
                      {[
                        "Check your card details and expiry date",
                        "Try a different payment method",
                        "Contact your bank to authorize the payment",
                        "Refresh and try again",
                        "Use a different browser or device"
                      ].map((solution, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-green-600 dark:text-green-400">{solution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={() => navigate('/checkout')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Payment Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/shop')}
                className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/20"
                size="lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </div>

            {/* Support Section */}
            <Card className="animate-slide-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <HelpCircle className="h-6 w-6" />
                  Still Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Our support team is ready to assist you with payment issues
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border shadow-lg">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Email Support</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">support@shopzyra.com</p>
                      <p className="text-xs text-gray-500">Response within 24 hours</p>
                    </div>
                    
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border shadow-lg">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Live Chat</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Available 9 AM - 6 PM</p>
                      <p className="text-xs text-gray-500">Monday to Friday</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-400 font-medium">
                        Good News: Your cart items are saved!
                      </p>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-500">
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
