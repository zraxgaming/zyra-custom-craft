
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Download, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle payment confirmation
    const handlePaymentConfirmation = async () => {
      const paymentToken = searchParams.get('token');
      const paymentId = searchParams.get('payment_id');
      
      if (paymentToken || paymentId) {
        // Process payment confirmation
        const pendingPayment = localStorage.getItem('pending_payment');
        if (pendingPayment) {
          try {
            const paymentData = JSON.parse(pendingPayment);
            
            // Create order in database
            const { data: newOrder, error } = await supabase
              .from('orders')
              .insert({
                user_id: paymentData.order_data.user_id,
                total_amount: paymentData.amount,
                status: 'processing',
                payment_status: 'paid',
                payment_method: paymentData.method,
                shipping_address: paymentData.order_data,
                billing_address: paymentData.order_data
              })
              .select()
              .single();

            if (error) throw error;

            setOrder(newOrder);
            localStorage.removeItem('pending_payment');
            
            toast({
              title: "Payment Successful!",
              description: "Your order has been confirmed.",
            });
          } catch (error) {
            console.error('Error processing payment:', error);
            toast({
              title: "Error",
              description: "There was an issue processing your order.",
              variant: "destructive",
            });
          }
        }
      } else if (orderId) {
        // Fetch existing order
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

          if (error) throw error;
          setOrder(data);
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      }
      
      setLoading(false);
    };

    handlePaymentConfirmation();
  }, [orderId, searchParams, toast]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <Container>
            <div className="max-w-2xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Card className="text-center animate-fade-in">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <CheckCircle className="h-8 w-8 text-green-600 animate-pulse" />
                </div>
                <CardTitle className="text-2xl text-green-600">Order Confirmed!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-lg">
                    Thank you for your order! We've received your payment and will start processing it right away.
                  </p>
                  {order && (
                    <p className="text-sm text-muted-foreground">
                      Order ID: #{order.id.slice(-8)}
                    </p>
                  )}
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-scale-in">
                  <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    What happens next?
                  </h3>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 text-left">
                    <li className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      We'll prepare your order for shipping
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      You'll receive a confirmation email shortly
                    </li>
                    <li className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Tracking information will be sent when shipped
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => window.location.href = '/dashboard'}
                    className="animate-bounce"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/shop'}
                    className="animate-pulse"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Questions about your order?</p>
                  <p className="font-medium">Contact us at support@zyra.com</p>
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

export default OrderSuccess;
