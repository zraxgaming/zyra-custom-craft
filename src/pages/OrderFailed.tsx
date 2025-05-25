
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { XCircle, RefreshCw, MessageCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const OrderFailed = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-12">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 animate-scale-in">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Failed</h1>
            <p className="text-muted-foreground">
              We're sorry, but there was an issue processing your order. Please try again.
            </p>
          </div>

          <Card className="mb-8 animate-scale-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="text-red-600">What went wrong?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="space-y-2">
                <h4 className="font-medium">Common issues:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Payment method was declined</li>
                  <li>• Network connection timeout</li>
                  <li>• Insufficient account balance</li>
                  <li>• Technical error during processing</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm">
                  <strong>Don't worry!</strong> Your payment has not been charged. 
                  You can safely try placing your order again.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="animate-scale-in" style={{ animationDelay: '300ms' }}>
              <CardContent className="p-6 text-center">
                <RefreshCw className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Try Again</h3>
                <p className="text-sm text-muted-foreground">
                  Return to checkout and retry your payment
                </p>
              </CardContent>
            </Card>

            <Card className="animate-scale-in" style={{ animationDelay: '400ms' }}>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact our support team for assistance
                </p>
              </CardContent>
            </Card>

            <Card className="animate-scale-in" style={{ animationDelay: '500ms' }}>
              <CardContent className="p-6 text-center">
                <ArrowLeft className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Continue Shopping</h3>
                <p className="text-sm text-muted-foreground">
                  Browse more products and try again later
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '600ms' }}>
            <Button asChild>
              <Link to="/checkout">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default OrderFailed;
