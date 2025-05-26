
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, Star, Gift, User, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

interface UserOrder {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items?: Array<{
    id: string;
    quantity: number;
    price: number;
    customization?: any;
    products: {
      id: string;
      name: string;
      images: string[];
    };
  }>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch user orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          payment_status,
          created_at,
          order_items (
            id,
            quantity,
            price,
            customization,
            products!inner (
              id,
              name,
              images
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <Container>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h1>
              <Button onClick={() => window.location.href = '/auth'}>
                Go to Login
              </Button>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        <Container>
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome back, {profile?.first_name || profile?.display_name || user.email}! 👋
              </h1>
              <p className="text-muted-foreground text-lg">
                Here's what's happening with your account
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="animate-slide-in-left bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                      <p className="text-3xl font-bold text-blue-700">{orders.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500 animate-bounce" />
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-in-up bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300" style={{animationDelay: '100ms'}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Completed</p>
                      <p className="text-3xl font-bold text-green-700">
                        {orders.filter(o => o.status === 'completed').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500 animate-bounce" />
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-in-up bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300" style={{animationDelay: '200ms'}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Total Spent</p>
                      <p className="text-3xl font-bold text-purple-700">
                        ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                      </p>
                    </div>
                    <Gift className="h-8 w-8 text-purple-500 animate-bounce" />
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-in-right bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-lg transition-all duration-300" style={{animationDelay: '300ms'}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-pink-600 font-medium">Rewards</p>
                      <p className="text-3xl font-bold text-pink-700">0</p>
                    </div>
                    <Star className="h-8 w-8 text-pink-500 animate-bounce" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-2">
                <Card className="animate-slide-in-left bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                        <Button onClick={() => window.location.href = '/shop'}>
                          Start Shopping
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order, index) => (
                          <div 
                            key={order.id} 
                            className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 animate-slide-in-up"
                            style={{animationDelay: `${index * 100}ms`}}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(order.status)}
                                  <span className="font-medium">Order #{order.id.slice(-8)}</span>
                                </div>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${order.total_amount.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            {order.order_items && order.order_items.length > 0 && (
                              <div className="space-y-2">
                                {order.order_items.slice(0, 2).map((item) => (
                                  <div key={item.id} className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
                                      {item.products?.images?.[0] ? (
                                        <img 
                                          src={item.products.images[0]} 
                                          alt={item.products.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-200"></div>
                                      )}
                                    </div>
                                    <span className="text-muted-foreground">
                                      {item.quantity}x {item.products?.name}
                                    </span>
                                    {item.customization && (
                                      <Badge variant="outline" className="text-xs">
                                        Customized
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                                {order.order_items.length > 2 && (
                                  <p className="text-xs text-muted-foreground">
                                    +{order.order_items.length - 2} more items
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {orders.length > 5 && (
                          <Button variant="outline" className="w-full">
                            View All Orders ({orders.length})
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Profile & Settings */}
              <div className="space-y-6">
                <Card className="animate-slide-in-right bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    {profile?.first_name && (
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{profile.first_name} {profile.last_name}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Member since</p>
                      <p className="font-medium">{new Date(user.created_at || '').toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card className="animate-slide-in-right bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200" style={{animationDelay: '200ms'}}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <Gift className="h-5 w-5" />
                      Loyalty Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-3">
                      <div className="text-3xl font-bold text-orange-600">0 Points</div>
                      <p className="text-sm text-muted-foreground">
                        Earn points with every purchase!
                      </p>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
