
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
  Shield,
  Mail,
  Phone,
  Edit
} from "lucide-react";

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const sendPasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;

      toast({
        title: "Password Reset Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
    navigate('/home');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <SEOHead 
        title="Dashboard - Zyra Custom Craft"
        description="Manage your account, orders, and preferences"
      />
      <Navbar />
      
      <div className="py-12 animate-fade-in">
        <Container>
          <div className="text-center mb-8 animate-scale-in">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome back, {profile.display_name || profile.first_name || 'User'}! ✨
            </p>
          </div>

          <div className="flex justify-between items-center mb-6 animate-slide-in-right">
            <div className="flex gap-4">
              {isAdmin && (
                <Button onClick={() => navigate('/admin')} className="hover-3d-lift">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/shop')} className="hover-3d-lift">
                <Package className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="hover-3d-lift">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 glass-card">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="glass-card border-gradient hover-3d-lift animate-scale-in">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{orders.length}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-gradient hover-3d-lift animate-scale-in" style={{animationDelay: '100ms'}}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{wishlistCount}</div>
                    <p className="text-xs text-muted-foreground">Saved items</p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-gradient hover-3d-lift animate-scale-in" style={{animationDelay: '200ms'}}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">Active</div>
                    <p className="text-xs text-muted-foreground">Verified account</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card border-gradient animate-slide-in-up">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any, index) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover-3d-lift animate-slide-in-up" style={{animationDelay: `${index * 50}ms`}}>
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
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-muted-foreground mb-4">No orders yet</p>
                      <Button onClick={() => navigate('/shop')} className="btn-premium">
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="glass-card border-gradient">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any, index) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover-3d-lift animate-slide-in-up" style={{animationDelay: `${index * 50}ms`}}>
                          <div className="space-y-1">
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()} • {order.payment_method}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Delivery: {order.delivery_type}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="font-medium">${order.total_amount} {order.currency}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <div>
                              <Button variant="outline" size="sm" className="hover-magnetic">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-muted-foreground">No orders found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="glass-card border-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profile.first_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                        className="hover-magnetic"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profile.last_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                        className="hover-magnetic"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={profile.display_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                      className="hover-magnetic"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="hover-magnetic"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="hover-magnetic"
                    />
                  </div>

                  <Button onClick={updateProfile} disabled={loading} className="btn-premium">
                    <User className="mr-2 h-4 w-4" />
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="grid gap-6">
                <Card className="glass-card border-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Password Reset</h4>
                        <p className="text-sm text-muted-foreground">Send a password reset link to your email</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={sendPasswordReset} className="hover-magnetic">
                        <Mail className="mr-2 h-4 w-4" />
                        Reset Password
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm" className="hover-magnetic">
                        <Shield className="mr-2 h-4 w-4" />
                        Setup 2FA
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Login Sessions</h4>
                        <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                      </div>
                      <Button variant="outline" size="sm" className="hover-magnetic">
                        <Users className="mr-2 h-4 w-4" />
                        View Sessions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
