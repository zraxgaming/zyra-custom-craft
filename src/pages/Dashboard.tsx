
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Clock, MapPin, Eye, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

interface UserOrder {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    customization?: any;
    products: {
      id: string;
      name: string;
      images: string[];
    };
  }[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      setProfile(profileData);

      // Fetch user orders with items and product details
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          payment_status,
          created_at,
          order_items!inner (
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
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedOrders = (ordersData || []).map(order => ({
        id: order.id,
        total_amount: order.total_amount,
        status: order.status,
        payment_status: order.payment_status,
        created_at: order.created_at,
        order_items: order.order_items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization,
          products: {
            id: item.product?.id || '',
            name: item.product?.name || 'Unknown Product',
            images: Array.isArray(item.product?.images) ? item.product.images : []
          }
        }))
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 particle-field-bg">
        <Container>
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-text-shimmer">
                Welcome back, {profile?.first_name || profile?.display_name || 'User'}!
              </h1>
              <p className="text-muted-foreground text-lg animate-slide-in-up">
                Here's an overview of your account and recent orders
              </p>
            </div>

            {/* Profile Summary */}
            <Card className="animate-scale-in hover:shadow-xl transition-all duration-500 hover-3d-lift border-gradient">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 animate-aurora">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/20 rounded-lg animate-float-gentle">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center animate-slide-in-left">
                    <div className="text-2xl font-bold text-primary animate-bounce-in">{orders.length}</div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="text-2xl font-bold text-green-600 animate-bounce-in">
                      {orders.filter(o => o.status === 'delivered').length}
                    </div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                  </div>
                  <div className="text-center animate-slide-in-right" style={{animationDelay: '0.4s'}}>
                    <div className="text-2xl font-bold text-blue-600 animate-bounce-in">
                      ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="animate-slide-in-up hover:shadow-xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12 animate-fade-in">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4 animate-bounce" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">Start shopping to see your orders here!</p>
                    <Button onClick={() => navigate('/shop')} className="animate-pulse">
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order, index) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-all duration-300 animate-slide-in-left hover-3d-lift" style={{animationDelay: `${index * 0.1}s`}}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Order #{order.id.slice(-8)}</span>
                              <Badge variant={
                                order.status === 'delivered' ? 'default' :
                                order.status === 'shipped' ? 'secondary' :
                                order.status === 'processing' ? 'outline' : 'destructive'
                              } className="animate-scale-in">
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-primary animate-bounce-in">
                              ${order.total_amount.toFixed(2)}
                            </p>
                            <Badge variant={
                              order.payment_status === 'paid' ? 'default' : 'destructive'
                            } className="animate-scale-in">
                              {order.payment_status}
                            </Badge>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.order_items.map((item, itemIndex) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg animate-fade-in" style={{animationDelay: `${itemIndex * 0.05}s`}}>
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden animate-scale-in">
                                {item.products.images && item.products.images.length > 0 ? (
                                  <img 
                                    src={item.products.images[0]} 
                                    alt={item.products.name}
                                    className="w-full h-full object-cover hover-3d-lift"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.products.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                {item.customization && (
                                  <div className="text-xs text-blue-600 animate-slide-in-up">
                                    <span className="font-medium">Custom: </span>
                                    {typeof item.customization === 'object' ? (
                                      <span>
                                        {item.customization.text && `Text: "${item.customization.text}"`}
                                        {item.customization.color && ` Color: ${item.customization.color}`}
                                      </span>
                                    ) : (
                                      item.customization
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {orders.length > 5 && (
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/orders')} 
                        className="w-full animate-bounce hover-3d-lift"
                      >
                        View All Orders
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="animate-scale-in hover:shadow-xl transition-all duration-500 hover-3d-lift">
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-primary animate-bounce" />
                  <h3 className="font-semibold mb-2">Browse Products</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover our latest collection
                  </p>
                  <Button onClick={() => navigate('/shop')} className="w-full animate-pulse">
                    Shop Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="animate-scale-in hover:shadow-xl transition-all duration-500 hover-3d-lift" style={{animationDelay: '0.2s'}}>
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 mx-auto mb-4 text-yellow-500 animate-bounce" />
                  <h3 className="font-semibold mb-2">Your Wishlist</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Items you want to buy later
                  </p>
                  <Button variant="outline" onClick={() => navigate('/wishlist')} className="w-full animate-pulse">
                    View Wishlist
                  </Button>
                </CardContent>
              </Card>

              <Card className="animate-scale-in hover:shadow-xl transition-all duration-500 hover-3d-lift" style={{animationDelay: '0.4s'}}>
                <CardContent className="p-6 text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-green-500 animate-bounce" />
                  <h3 className="font-semibold mb-2">Account Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your profile and preferences
                  </p>
                  <Button variant="outline" onClick={() => navigate('/settings')} className="w-full animate-pulse">
                    Manage Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
