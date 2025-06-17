import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ShoppingBag, ArrowRight, Package, Truck, CreditCard, MapPin, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import SEOHead from "@/components/seo/SEOHead";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate("/");
        return;
      }
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              *,
              products (
                name,
                images
              )
            ),
            profiles (
              display_name,
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .eq("id", orderId)
          .single();
        if (error) throw error;
        setOrder(data);
      } catch (error: any) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error fetching order",
          description: "Could not find your order. You may have been redirected.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate, toast]);

  useEffect(() => {
    if (order && order.profiles?.email) {
      import('@/utils/resend').then(({ sendOrderEmail }) => {
        sendOrderEmail({
          to: order.profiles.email,
          subject: `Order Confirmation - Zyra Custom Craft #${order.id.slice(-8)}`,
          html: `<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;\">
            <h2 style=\"color:#7c3aed;\">Thank you for your order!</h2>
            <p>Your order <b>#${order.id.slice(-8)}</b> has been received and is being processed.</p>
            <p><b>Total:</b> $${order.total_amount.toFixed(2)}</p>
            <p>We'll notify you when your order ships.</p>
            <hr />
            <p style=\"font-size:13px;color:#888;\">Zyra Custom Craft</p>
          </div>`
        })
        .then(() => toast({ title: 'Confirmation email sent', description: 'Check your inbox for order details.' }))
        .catch((err) => toast({ title: 'Email failed', description: err.message, variant: 'destructive' }));
      });
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-16 flex justify-center animate-fade-in">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-6xl py-16 animate-fade-in">
        <Card className="text-center p-8">
          <CardContent>
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Button onClick={() => navigate("/")} className="hover:scale-105 transition-transform">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing": return <Clock className="h-5 w-5" />;
      case "shipped": return <Truck className="h-5 w-5" />;
      case "delivered": return <Package className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <SEOHead 
        title={`Order Confirmation #${order.id.slice(-8)}`}
        description="Your order has been confirmed. View order details and tracking information."
      />
      
      <div className="container max-w-6xl py-16 animate-fade-in">
        {/* Success Header */}
        <div className="text-center mb-12 animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Order Confirmed! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thank you for your order! We've received your order and will begin processing it right away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info Card */}
            <Card className="animate-slide-in-right" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Order Number</h3>
                      <p className="font-semibold text-lg">#{order.id.slice(-8)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Date Placed</h3>
                      <p className="font-semibold">{format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Order Status</h3>
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                      <p className="font-bold text-2xl text-primary">${order.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="animate-slide-in-right" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item: any, index: number) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.products?.images && item.products.images.length > 0 ? (
                          <img
                            src={item.products.images[0]}
                            alt={item.products?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.products?.name || 'Product'}</h4>
                        <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                        {item.customization && (
                          <p className="text-sm text-muted-foreground">Customized</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="animate-slide-in-right" style={{ animationDelay: "600ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                    <p className="font-semibold capitalize">{order.payment_method?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                      {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="animate-slide-in-right" style={{ animationDelay: "800ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="h-6 w-6 text-primary" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                    <p className="font-semibold">
                      {order.profiles?.display_name || 
                       `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim() ||
                       'Customer'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <p className="font-semibold">{order.profiles?.email || 'N/A'}</p>
                  </div>
                  {order.profiles?.phone && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                      <p className="font-semibold">{order.profiles.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            {order.shipping_address && (
              <Card className="animate-slide-in-right" style={{ animationDelay: "1000ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {typeof order.shipping_address === 'string' ? (
                      <p>{order.shipping_address}</p>
                    ) : (
                      <>
                        <p className="font-semibold">{order.shipping_address.name || order.shipping_address.fullName}</p>
                        <p>{order.shipping_address.street || order.shipping_address.addressLine1}</p>
                        {(order.shipping_address.addressLine2) && (
                          <p>{order.shipping_address.addressLine2}</p>
                        )}
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                        </p>
                        <p>{order.shipping_address.country}</p>
                        {order.shipping_address.phone && (
                          <p className="text-sm text-muted-foreground">{order.shipping_address.phone}</p>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tracking Info */}
            {order.tracking_number && (
              <Card className="animate-slide-in-right" style={{ animationDelay: "1200ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-primary" />
                    Tracking Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tracking Number</h3>
                    <p className="font-mono font-semibold text-lg">{order.tracking_number}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="space-y-3 animate-slide-in-right" style={{ animationDelay: "1400ms" }}>
              <Link to="/shop" className="block">
                <Button variant="outline" className="w-full hover:scale-105 transition-transform">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/dashboard" className="block">
                <Button className="w-full hover:scale-105 transition-transform">
                  View All Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
