
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Download, Star, ArrowRight, Gift, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
    // Clear any pending payment data
    localStorage.removeItem('pending_payment');
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            customization,
            product:products!order_items_product_id_fkey (
              id,
              name,
              images
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 particle-field-bg">
          <Container>
            <div className="flex items-center justify-center min-h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 relative overflow-hidden particle-field-bg mesh-gradient-bg">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-3xl animate-float-gentle"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-3xl animate-particle-float"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-300 to-green-400 rounded-full blur-3xl animate-morphing-gradient opacity-20"></div>
        </div>

        <Container>
          <div className="max-w-4xl mx-auto relative z-10">
            {/* Success Header */}
            <Card className="text-center animate-scale-in mb-8 card-premium border-gradient hover-3d-lift">
              <CardHeader className="animate-aurora">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mb-6 animate-bounce-in shadow-2xl hover-neon-glow">
                  <CheckCircle className="h-12 w-12 text-green-600 animate-elastic-scale" />
                </div>
                <CardTitle className="text-4xl text-green-600 mb-4 animate-fade-in animate-text-shimmer">
                  🎉 Payment Successful!
                </CardTitle>
                <div className="flex items-center justify-center gap-2 animate-slide-in-up">
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-bounce" />
                  <p className="text-xl text-muted-foreground">
                    Thank you for your order! Your payment has been processed successfully.
                  </p>
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-bounce" style={{animationDelay: '0.2s'}} />
                </div>
              </CardHeader>
            </Card>

            {/* Order Details */}
            {order && (
              <Card className="animate-slide-in-left mb-8 card-premium hover-3d-lift">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 animate-morphing-gradient">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Package className="h-6 w-6 animate-float-gentle" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="animate-slide-in-up">
                        <h4 className="font-semibold text-green-700 mb-2">Order Information</h4>
                        <div className="space-y-2">
                          <p className="flex justify-between">
                            <span className="text-muted-foreground">Order ID:</span>
                            <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded animate-scale-in">
                              #{order.id.slice(-8)}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge className="bg-green-500 text-white animate-bounce-in">
                              {order.status}
                            </Badge>
                          </p>
                        </div>
                      </div>

                      <div className="animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                        <h4 className="font-semibold text-green-700 mb-2">Payment Details</h4>
                        <div className="space-y-2">
                          <p className="flex justify-between">
                            <span className="text-muted-foreground">Payment Method:</span>
                            <span className="capitalize">{order.payment_method || 'Card'}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-muted-foreground">Payment Status:</span>
                            <Badge className="bg-green-500 text-white animate-scale-in">
                              Paid
                            </Badge>
                          </p>
                          <p className="flex justify-between text-lg font-bold">
                            <span className="text-green-700">Total Amount:</span>
                            <span className="text-green-600 animate-bounce-in">
                              ${order.total_amount.toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="animate-slide-in-up" style={{animationDelay: '0.4s'}}>
                        <h4 className="font-semibold text-green-700 mb-4">Items Ordered</h4>
                        <div className="space-y-3">
                          {order.order_items?.map((item: any, index: number) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg animate-scale-in hover-magnetic" style={{animationDelay: `${index * 0.1}s`}}>
                              <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shadow-md hover-3d-lift">
                                {item.product?.images && item.product.images.length > 0 ? (
                                  <img 
                                    src={item.product.images[0]} 
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.product?.name || 'Product'}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                {item.customization && (
                                  <div className="text-xs text-green-600 animate-slide-in-up">
                                    <span className="font-medium">Custom: </span>
                                    {typeof item.customization === 'object' ? (
                                      <span>
                                        {item.customization.text && `"${item.customization.text}"`}
                                        {item.customization.color && ` (${item.customization.color})`}
                                      </span>
                                    ) : (
                                      item.customization
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-bold text-green-600">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card className="animate-slide-in-up card-premium hover-3d-lift">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 animate-aurora">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Gift className="h-6 w-6 animate-float-gentle" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center animate-scale-in hover-magnetic">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-3d-lift">
                      <Package className="h-8 w-8 text-blue-600 animate-bounce" />
                    </div>
                    <h4 className="font-semibold mb-2 text-blue-700">Order Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll start preparing your order within 24 hours
                    </p>
                  </div>
                  
                  <div className="text-center animate-scale-in hover-magnetic" style={{animationDelay: '0.2s'}}>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-3d-lift">
                      <Download className="h-8 w-8 text-green-600 animate-bounce" />
                    </div>
                    <h4 className="font-semibold mb-2 text-green-700">Email Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      Check your email for order confirmation and tracking details
                    </p>
                  </div>
                  
                  <div className="text-center animate-scale-in hover-magnetic" style={{animationDelay: '0.4s'}}>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-3d-lift">
                      <Star className="h-8 w-8 text-purple-600 animate-bounce" />
                    </div>
                    <h4 className="font-semibold mb-2 text-purple-700">Share Your Experience</h4>
                    <p className="text-sm text-muted-foreground">
                      Leave a review once you receive your items
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in">
              <Button
                onClick={() => navigate('/dashboard')}
                className="btn-premium hover-ripple animate-elastic-scale"
                size="lg"
              >
                <Package className="h-5 w-5 mr-2" />
                View Order History
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/shop')}
                className="hover-3d-lift animate-pulse"
                size="lg"
              >
                Continue Shopping
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 animate-slide-in-up hover-magnetic">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 animate-bounce" />
                <div>
                  <h4 className="font-semibold text-green-800">Secure Transaction</h4>
                  <p className="text-sm text-green-700">
                    Your payment was processed securely. You'll receive email updates about your order status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;
