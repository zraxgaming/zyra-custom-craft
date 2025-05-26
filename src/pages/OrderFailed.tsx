
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
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
      <div className="min-h-screen bg-background py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-lg text-muted-foreground">
                    Unfortunately, your payment could not be processed.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This could be due to insufficient funds, an expired card, or a technical issue.
                    Please try again or contact your payment provider.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    What can you do?
                  </h3>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 text-left">
                    <li>• Check your payment information and try again</li>
                    <li>• Contact your bank or payment provider</li>
                    <li>• Try a different payment method</li>
                    <li>• Contact our support team if the issue persists</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/checkout')}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/shop')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Need help? Contact us at:</p>
                  <p className="font-medium">support@shopzyra.com</p>
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
