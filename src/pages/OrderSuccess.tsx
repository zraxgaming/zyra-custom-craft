
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CheckCircle, Package, Download, ArrowRight, Truck, Mail, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/seo/SEOHead";

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
      <>
        <SEOHead 
          title="Order Confirmation - Zyra"
          description="Your order has been confirmed. Thank you for shopping with Zyra!"
          url={`https://zyra.lovable.app/order-success/${orderId}`}
        />
        <Navbar />
        <Container className="py-12">
          <div className="flex justify-center animate-fade-in">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  const nextSteps = [
    {
      icon: Mail,
      title: "Confirmation Email",
      description: "Check your email for order details and receipt",
      status: "completed"
    },
    {
      icon: Package,
      title: "Processing",
      description: "We're preparing your items for shipment",
      status: order?.status === "processing" ? "current" : "pending"
    },
    {
      icon: Truck,
      title: "Shipping",
      description: "Your order will be shipped within 2-3 business days",
      status: order?.status === "shipped" ? "current" : "pending"
    },
    {
      icon: CheckCircle,
      title: "Delivery",
      description: "Enjoy your new products!",
      status: order?.status === "delivered" ? "completed" : "pending"
    }
  ];

  return (
    <>
      <SEOHead 
        title="Order Confirmation - Zyra"
        description="Your order has been confirmed. Thank you for shopping with Zyra!"
        url={`https://zyra.lovable.app/order-success/${orderId}`}
      />
      <Navbar />
      
      {/* Success Hero */}
      <section className="relative py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/10 dark:via-emerald-900/10 dark:to-teal-900/10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                <CheckCircle className="h-10 w-10 text-green-600 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Order Confirmed!
              </h1>
              <p className="text-xl text-muted-foreground animate-slide-in-right">
                Thank you for your purchase. Your order has been successfully placed and is being processed.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12 space-y-8">
        {order && (
          <>
            {/* Order Details */}
            <Card className="animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-green-600" />
                    <span>Order #{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-semibold">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <h3 className="font-semibold mb-2">Payment Information</h3>
                    <p className="text-muted-foreground">Total Amount: <span className="font-semibold text-foreground">${order.total_amount}</span></p>
                    <p className="text-muted-foreground">Payment Method: <span className="font-semibold text-foreground">{order.payment_method || 'Credit Card'}</span></p>
                    <p className="text-muted-foreground">Status: <span className="font-semibold text-green-600">{order.payment_status}</span></p>
                  </div>
                  
                  {order.shipping_address && (
                    <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>{order.shipping_address.name}</p>
                        <p>{order.shipping_address.street}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <h3 className="font-semibold mb-2">Delivery Information</h3>
                    <p className="text-muted-foreground">Method: <span className="font-semibold text-foreground">{order.delivery_type || 'Standard'}</span></p>
                    <p className="text-muted-foreground">Estimated: <span className="font-semibold text-foreground">3-5 business days</span></p>
                    {order.tracking_number && (
                      <p className="text-muted-foreground">Tracking: <span className="font-semibold text-foreground">{order.tracking_number}</span></p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            {order.order_items && order.order_items.length > 0 && (
              <Card className="animate-scale-in" style={{ animationDelay: '400ms' }}>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.order_items.map((item: any, index: number) => (
                      <div 
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-border/50 rounded-lg animate-fade-in"
                        style={{ animationDelay: `${(index + 5) * 100}ms` }}
                      >
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          {item.products?.images && Array.isArray(item.products.images) && item.products.images.length > 0 ? (
                            <img
                              src={item.products.images[0]}
                              alt={item.products?.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.products?.name || 'Product'}</h4>
                          <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                          {item.customization && Object.keys(item.customization).length > 0 && (
                            <p className="text-sm text-primary">Customized</p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Progress */}
            <Card className="animate-scale-in" style={{ animationDelay: '500ms' }}>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {nextSteps.map((step, index) => (
                    <div 
                      key={step.title}
                      className={`flex items-center gap-4 animate-fade-in ${
                        step.status === 'completed' ? 'opacity-100' : 
                        step.status === 'current' ? 'opacity-100' : 'opacity-50'
                      }`}
                      style={{ animationDelay: `${(index + 8) * 100}ms` }}
                    >
                      <div className={`p-3 rounded-full ${
                        step.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                        step.status === 'current' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        'bg-muted'
                      }`}>
                        <step.icon className={`h-5 w-5 ${
                          step.status === 'completed' ? 'text-green-600' :
                          step.status === 'current' ? 'text-blue-600' :
                          'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                      {step.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '600ms' }}>
          <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 hover:scale-105">
            <Link to="/shop">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105">
            <Link to="/dashboard">
              View Dashboard
            </Link>
          </Button>
          
          {order && (
            <Button variant="outline" className="hover:bg-secondary transition-all duration-300 hover:scale-105">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          )}
        </div>

        {/* Review Prompt */}
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 animate-scale-in" style={{ animationDelay: '700ms' }}>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold">Love your purchase?</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Share your experience and help other customers by leaving a review.
            </p>
            <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105">
              <Star className="h-4 w-4 mr-2" />
              Leave a Review
            </Button>
          </CardContent>
        </Card>
      </Container>
      
      <Footer />
    </>
  );
};

export default OrderSuccess;
