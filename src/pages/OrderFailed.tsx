
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, ShoppingBag, ArrowLeft, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const OrderFailed = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-16">
        <div className="bg-card p-8 rounded-lg shadow-sm border max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Payment Failed</h1>
            <p className="text-muted-foreground max-w-md">
              We're sorry, but your payment could not be processed. Please try again or contact our support team for assistance.
            </p>
          </div>

          {orderId && (
            <div className="bg-muted/50 p-6 rounded-lg mb-8">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">Order Reference</h3>
                <p className="font-semibold text-foreground">{orderId.substring(0, 8)}...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Keep this reference number for any inquiries
                </p>
              </div>
            </div>
          )}

          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <h2 className="text-lg font-semibold mb-4 text-foreground">What happened?</h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Payment processing was interrupted</li>
              <li>• Insufficient funds or payment method declined</li>
              <li>• Network connection issues</li>
              <li>• Billing information mismatch</li>
            </ul>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Next Steps</h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Check your payment method and billing information</li>
              <li>• Ensure you have sufficient funds</li>
              <li>• Try a different payment method</li>
              <li>• Contact your bank if the issue persists</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/checkout">
              <Button className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link to="/shop">
              <Button variant="ghost" className="text-muted-foreground">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default OrderFailed;
