
import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle, Package, Download } from "lucide-react";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const paymentMethod = searchParams.get("payment_method");
  
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: orderId,
        value: 0,
        currency: 'USD'
      });
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-3xl text-foreground">
                Order Confirmed!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase! Your order has been successfully placed.
              </p>
              
              {orderId && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono text-lg text-foreground">{orderId}</p>
                </div>
              )}

              {paymentMethod && (
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="capitalize text-foreground">{paymentMethod}</p>
                </div>
              )}

              <div className="flex flex-col gap-4 pt-6">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Package className="w-5 h-5" />
                  <span>You will receive a confirmation email shortly</span>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/account/orders">View Orders</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
