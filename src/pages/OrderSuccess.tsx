
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CheckCircle, Package, Download, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, images, price)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container className="py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-12">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 animate-scale-in">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {order && (
            <Card className="mb-8 animate-scale-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Package className="h-5 w-5" />
                  Order #{order.id.slice(0, 8)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Order Date</p>
                    <p className="text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Total Amount</p>
                    <p className="text-muted-foreground">${order.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Payment Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Delivery Type</p>
                    <p className="text-muted-foreground">
                      {order.delivery_type?.charAt(0).toUpperCase() + order.delivery_type?.slice(1)}
                    </p>
                  </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            {item.products?.images?.[0] && (
                              <img
                                src={item.products.images[0]}
                                alt={item.products.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.products?.name}</p>
                              <p className="text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="animate-scale-in" style={{ animationDelay: '300ms' }}>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Your order is being prepared for shipment
                </p>
              </CardContent>
            </Card>

            <Card className="animate-scale-in" style={{ animationDelay: '400ms' }}>
              <CardContent className="p-6 text-center">
                <Download className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Track Your Order</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive tracking information via email
                </p>
              </CardContent>
            </Card>

            <Card className="animate-scale-in" style={{ animationDelay: '500ms' }}>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Order Updates</h3>
                <p className="text-sm text-muted-foreground">
                  We'll keep you informed every step of the way
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '600ms' }}>
            <Button asChild>
              <Link to="/dashboard">
                View Order History
                <ArrowRight className="h-4 w-4 ml-2" />
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

export default OrderSuccess;
