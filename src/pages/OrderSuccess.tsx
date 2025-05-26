
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Download, ArrowLeft, Gift, Star } from "lucide-react";
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
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleOrderConfirmation();
  }, [orderId, searchParams]);

  const handleOrderConfirmation = async () => {
    try {
      if (orderId) {
        // Fetch existing order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        // Fetch order items with product details
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products!inner (
              id,
              name,
              images,
              slug
            )
          `)
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        setOrder(orderData);
        setOrderItems(itemsData || []);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: "Error",
        description: "Could not load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl animate-float-reverse"></div>
        </div>
        
        <Container>
          <div className="max-w-4xl mx-auto relative z-10">
            {/* Success Header */}
            <Card className="text-center animate-scale-in mb-8 bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg">
                  <CheckCircle className="h-10 w-10 text-green-600 animate-pulse" />
                </div>
                <CardTitle className="text-3xl text-green-600 mb-2 animate-fade-in">🎉 Order Confirmed!</CardTitle>
                <p className="text-lg text-muted-foreground animate-slide-in-up">
                  Thank you for your purchase! Your order has been successfully placed.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {order && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 animate-slide-in-right">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="animate-bounce" style={{animationDelay: '0.2s'}}>
                        <p className="text-sm text-muted-foreground">Order Number</p>
                        <p className="font-bold text-lg">#{order.id.slice(-8)}</p>
                      </div>
                      <div className="animate-bounce" style={{animationDelay: '0.4s'}}>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="font-bold text-lg text-green-600">${order.total_amount.toFixed(2)}</p>
                      </div>
                      <div className="animate-bounce" style={{animationDelay: '0.6s'}}>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-bold text-lg capitalize">{order.payment_method || 'Card'}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 animate-scale-in">
                  <h3 className="font-medium text-blue-800 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 animate-bounce" />
                    What happens next?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                    <div className="text-center animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                      <Package className="h-8 w-8 mx-auto mb-2 animate-bounce" />
                      <p className="font-medium">Order Processing</p>
                      <p className="text-xs">We'll prepare your items</p>
                    </div>
                    <div className="text-center animate-slide-in-up" style={{animationDelay: '0.4s'}}>
                      <Download className="h-8 w-8 mx-auto mb-2 animate-bounce" />
                      <p className="font-medium">Email Confirmation</p>
                      <p className="text-xs">Check your inbox shortly</p>
                    </div>
                    <div className="text-center animate-slide-in-right" style={{animationDelay: '0.6s'}}>
                      <Package className="h-8 w-8 mx-auto mb-2 animate-bounce" />
                      <p className="font-medium">Shipping Updates</p>
                      <p className="text-xs">Track your package</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            {orderItems.length > 0 && (
              <Card className="animate-slide-in-up bg-white/80 backdrop-blur-sm mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-600" />
                    Your Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg animate-slide-in-right hover:shadow-md transition-all duration-300"
                        style={{animationDelay: `${index * 100}ms`}}
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          {item.products?.images?.[0] ? (
                            <img 
                              src={item.products.images[0]} 
                              alt={item.products.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.products?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                          {item.customization && (
                            <div className="mt-2 text-xs bg-white p-2 rounded border">
                              <p className="font-medium mb-1">Customization:</p>
                              {typeof item.customization === 'object' ? (
                                <div className="space-y-1">
                                  {item.customization.text && (
                                    <p>Text: <span className="font-medium">"{item.customization.text}"</span></p>
                                  )}
                                  {item.customization.color && (
                                    <p className="flex items-center gap-2">
                                      Color: 
                                      <span 
                                        className="w-4 h-4 rounded border"
                                        style={{ backgroundColor: item.customization.color }}
                                      ></span>
                                      <span className="font-medium">{item.customization.color}</span>
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p>{JSON.stringify(item.customization)}</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="animate-bounce bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                size="lg"
              >
                <Package className="h-4 w-4 mr-2" />
                View My Orders
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/shop'}
                className="animate-pulse hover:scale-105 transition-transform duration-300"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>

            {/* Contact Support */}
            <Card className="mt-8 text-center bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 animate-slide-in-up">
              <CardContent className="p-6">
                <Star className="h-8 w-8 mx-auto mb-4 text-yellow-500 animate-spin" style={{animationDuration: '3s'}} />
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about your order? We're here to help!
                </p>
                <div className="text-sm">
                  <p className="font-medium">📧 support@shopzyra.com</p>
                  <p className="text-muted-foreground">We typically respond within 24 hours</p>
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
