
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Mail, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import TypeformFeedback from "@/components/feedback/TypeformFeedback";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const OrderSuccess = () => {
  const { orderId } = useParams();

  useEffect(() => {
    // Track order success for analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        currency: 'USD'
      });
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <Card className="mb-8 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-semibold text-foreground">#{orderId}</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your email address
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  We'll notify you when your order ships
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 mb-8">
            <Link to="/order-tracking">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Track Your Order
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Customer Feedback Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Star className="h-5 w-5 text-yellow-500" />
                How Was Your Experience?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Help us improve by sharing your shopping experience. Your feedback is valuable to us!
              </p>
              <TypeformFeedback 
                typeformId="GcTxpZxC"
                triggerText="Share Your Experience"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                openInNewTab={true}
              />
            </CardContent>
          </Card>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
