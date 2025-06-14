
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  Package, 
  CreditCard, 
  Gift,
  Shield,
  Bell,
  Mail
} from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Dashboard = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/dashboard');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch wishlist count
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user?.id);

      if (wishlistError) throw wishlistError;
      setWishlistCount(wishlistData?.length || 0);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <>
      <SEOHead 
        title="Dashboard - Zyra Custom Craft"
        description="Manage your account, orders, and preferences."
        url="https://shopzyra.vercel.app/dashboard"
      />
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10">
        <Container className="py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.first_name || user.email}!
              </h1>
              <p className="text-muted-foreground">
                Manage your account and track your orders
              </p>
            </div>

            {/* Admin Panel Access */}
            {isAdmin && (
              <Card className="mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-purple-900">Admin Panel</h3>
                        <p className="text-sm text-purple-700">Manage your store and products</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/admin')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Access Admin Panel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Heart className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Wishlist Items</p>
                      <p className="text-2xl font-bold">{wishlistCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <User className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Account Status</p>
                      <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-muted/50 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${order.total_amount}</p>
                            <Badge variant="outline" className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <Button 
                        onClick={() => navigate('/shop')}
                        className="mt-4"
                        variant="outline"
                      >
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/wishlist')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    View Wishlist
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/gift-cards')}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Gift Cards
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handlePasswordReset}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/cart')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View Cart
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
