
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  CreditCard, 
  MapPin, 
  Bell,
  Gift,
  Users,
  LogOut,
  Eye,
  ShoppingBag,
  Loader2
} from "lucide-react";

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [profile, setProfile] = useState({
    display_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setDataLoading(true);
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({
          display_name: profileData.display_name || '',
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone: profileData.phone || '',
          email: profileData.email || user.email || ''
        });
      }

      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setOrders(ordersData || []);

      // Fetch wishlist count
      const { data: wishlistData } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id);

      setWishlistCount(wishlistData?.length || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setDataLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Dashboard - Zyra Custom Craft"
          description="Manage your account, orders, and preferences"
        />
        <Navbar />
        <Container className="py-12">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Dashboard - Zyra Custom Craft"
        description="Manage your account, orders, and preferences"
      />
      <Navbar />
      
      <div className="py-12">
        <Container>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, {profile.display_name || profile.first_name || user.email}!
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              {isAdmin && (
                <Button onClick={() => navigate('/admin')} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/shop')}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{orders.length}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{wishlistCount}</div>
                    <p className="text-xs text-muted-foreground">Saved items</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Active</div>
                    <p className="text-xs text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total_amount}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                      <Button onClick={() => navigate('/shop')}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="space-y-1">
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()} • {order.payment_method || 'Online Payment'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Delivery: {order.delivery_type || 'Standard'}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="font-medium">${order.total_amount} {order.currency || 'USD'}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <div>
                              <Button variant="outline" size="sm" onClick={() => navigate(`/order/${order.id}`)}>
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                      <p className="text-muted-foreground mb-4">Your order history will appear here</p>
                      <Button onClick={() => navigate('/shop')}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profile.first_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profile.last_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={profile.display_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <Button onClick={updateProfile} disabled={loading}>
                    <User className="mr-2 h-4 w-4" />
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Shipping Addresses</h4>
                        <p className="text-sm text-muted-foreground">Manage your delivery addresses</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        Manage
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Payment Methods</h4>
                        <p className="text-sm text-muted-foreground">Manage your payment options</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="referrals">
              <Card>
                <CardHeader>
                  <CardTitle>Referral Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Refer Friends & Earn Rewards</h3>
                    <p className="text-muted-foreground mb-6">
                      Share your unique referral code and earn credits when your friends make their first purchase.
                    </p>
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
                        <p className="font-mono text-lg font-bold">USER{user.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <Button className="w-full">
                        <Users className="mr-2 h-4 w-4" />
                        Share Referral Code
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
