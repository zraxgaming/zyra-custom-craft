
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Search, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      toast({
        title: "Order Number Required",
        description: "Please enter an order number to track",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              images
            )
          )
        `)
        .eq('id', orderNumber)
        .single();

      if (error || !orderData) {
        toast({
          title: "Order Not Found",
          description: "Please check your order number and try again",
          variant: "destructive"
        });
        setOrder(null);
        return;
      }

      setOrder(orderData);
    } catch (error) {
      console.error('Error tracking order:', error);
      toast({
        title: "Error",
        description: "Failed to track order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-600" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <>
      <SEOHead 
        title="Track Your Order - Zyra"
        description="Track your order status and delivery information"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <Package className="h-16 w-16 text-primary mx-auto mb-6 animate-bounce" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
                Track Your Order
              </h1>
              <p className="text-xl text-muted-foreground">
                Enter your order number to see real-time tracking information
              </p>
            </div>

            {/* Search Form */}
            <Card className="mb-8 animate-slide-in-up card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Order Lookup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="order-number" className="sr-only">Order Number</Label>
                    <Input
                      id="order-number"
                      placeholder="Enter your order number (e.g., ORD-123456)"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="text-lg py-6"
                    />
                  </div>
                  <Button 
                    onClick={handleTrackOrder}
                    disabled={loading}
                    className="btn-premium px-8 py-6"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Track Order
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            {order && (
              <div className="space-y-8 animate-fade-in">
                {/* Order Status */}
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        Order #{order.id.slice(-8)}
                      </span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Order Date</p>
                        <p className="font-semibold">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Payment Status</p>
                        <p className="font-semibold">{order.payment_status}</p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                        <p className="font-semibold">{order.tracking_number || 'TBD'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="font-semibold">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                        <p>{order.shipping_address.address}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Order Items */}
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                          <img
                            src={item.products.images[0] || '/placeholder-product.jpg'}
                            alt={item.products.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.products.name}</h4>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            {item.customization && (
                              <div className="text-xs text-blue-600 mt-1">
                                Customized
                              </div>
                            )}
                          </div>
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tracking Timeline */}
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Tracking Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold">Order Placed</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {order.status !== 'pending' && (
                        <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Package className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-semibold">Order Confirmed</p>
                            <p className="text-sm text-muted-foreground">Your order is being processed</p>
                          </div>
                        </div>
                      )}
                      
                      {(order.status === 'shipped' || order.status === 'completed') && (
                        <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <Truck className="h-6 w-6 text-yellow-600" />
                          <div>
                            <p className="font-semibold">Order Shipped</p>
                            <p className="text-sm text-muted-foreground">
                              Tracking: {order.tracking_number || 'TBD'}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {order.status === 'completed' && (
                        <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <div>
                            <p className="font-semibold">Order Delivered</p>
                            <p className="text-sm text-muted-foreground">Your order has been delivered</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default OrderTracking;
