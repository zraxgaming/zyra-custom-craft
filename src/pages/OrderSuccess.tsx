import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, ArrowRight, ShoppingBag, CreditCard, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from '@/components/seo/SEOHead';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
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
        <div className="min-h-screen bg-background py-12">
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
      <SEOHead 
        title="Order Success - Zyra Custom Craft"
        description="Your order was successful! Thank you for shopping at Zyra Custom Craft. Track your order and view details here."
        url={`https://shopzyra.vercel.app/order-success/${orderId || ''}`}
        keywords="order success, confirmation, zyra, custom craft, thank you"
      />
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground text-lg">
                Thank you for your order. Your payment has been processed successfully.
              </p>
            </div>

            {order && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Order Number</h4>
                        <p className="text-muted-foreground">#{order.id.slice(-8)}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Date</h4>
                        <p className="text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Total</h4>
                        <p className="text-2xl font-bold text-primary">
                          ${order.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            {item.product?.images && item.product.images.length > 0 ? (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product?.name || 'Product'}</h4>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Payment Method:</span>
                          <Badge variant="outline" className="capitalize">
                            {order.payment_method}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className="bg-green-500 text-white">
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {order.shipping_address && (
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">
                            {order.shipping_address.firstName} {order.shipping_address.lastName}
                          </p>
                          <p>{order.shipping_address.address}</p>
                          <p>
                            {order.shipping_address.city}, {order.shipping_address.zipCode}
                          </p>
                          <p>{order.shipping_address.country}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                View Order History
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/shop')}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;
