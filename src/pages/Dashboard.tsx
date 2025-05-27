
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { User, ShoppingBag, Heart, Gift, Users, Settings, LogOut, Award, Star, TrendingUp, Calendar } from "lucide-react";

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: ''
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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
      } else if (profileData) {
        setProfile(profileData);
        setProfileData({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone: profileData.phone || '',
          address: profileData.address || ''
        });
      }

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (ordersError) {
        console.error('Orders error:', ordersError);
      } else {
        setOrders(ordersData || []);
      }

      // Fetch gift cards
      const { data: giftCardsData, error: giftCardsError } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (giftCardsError) {
        console.error('Gift cards error:', giftCardsError);
      } else {
        setGiftCards(giftCardsData || []);
      }

      // Fetch referrals
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('created_at', { ascending: false });

      if (referralsError) {
        console.error('Referrals error:', referralsError);
      } else {
        setReferrals(referralsData || []);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      setEditMode(false);
      fetchUserData();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/home');
    } catch (error: any) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalGiftCards = giftCards.reduce((sum, card) => sum + (card.amount || 0), 0);
  const activeReferrals = referrals.filter(ref => ref.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <Navbar />
      
      <div className="py-12">
        <Container>
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 animate-fade-in">
            <div className="flex items-center gap-6 mb-6 lg:mb-0">
              <Avatar className="w-20 h-20 border-4 border-purple-200 dark:border-purple-800">
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                  Welcome Back!
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                  {profile?.first_name} {profile?.last_name} | {user?.email}
                </p>
                {isAdmin && (
                  <Badge className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <Award className="h-3 w-3 mr-1" />
                    Administrator
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {isAdmin && (
                <Button
                  onClick={() => navigate('/admin')}
                  variant="outline"
                  className="border-purple-200 hover:border-purple-400 dark:border-purple-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-red-200 hover:border-red-400 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="animate-slide-in-left border-gradient hover-3d-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-left border-gradient hover-3d-lift" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-left border-gradient hover-3d-lift" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                    <Gift className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gift Cards</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalGiftCards.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-in-left border-gradient hover-3d-lift" style={{animationDelay: '0.3s'}}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Referrals</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeReferrals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <Card className="lg:col-span-1 animate-slide-in-left border-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={profileData.first_name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                          className="hover-magnetic"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={profileData.last_name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                          className="hover-magnetic"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="hover-magnetic"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        className="hover-magnetic"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile} className="flex-1 hover-3d-lift">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditMode(false)} className="hover-3d-lift">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{profile?.address || 'Not provided'}</p>
                    </div>
                    <Button onClick={() => setEditMode(true)} className="w-full hover-3d-lift">
                      Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders & Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Orders */}
              <Card className="animate-slide-in-right border-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-green-600" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order, index) => (
                        <div key={order.id} className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-md transition-all duration-300 animate-fade-in hover-3d-lift`} style={{animationDelay: `${index * 100}ms`}}>
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${order.total_amount?.toFixed(2)}</p>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No orders yet</p>
                      <Button onClick={() => navigate('/shop')} className="mt-4 hover-3d-lift">
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="animate-slide-in-up border-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      onClick={() => navigate('/shop')} 
                      variant="outline" 
                      className="h-20 flex-col gap-2 hover-3d-lift"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span className="text-sm">Shop</span>
                    </Button>
                    <Button 
                      onClick={() => navigate('/gift-cards')} 
                      variant="outline" 
                      className="h-20 flex-col gap-2 hover-3d-lift"
                    >
                      <Gift className="h-5 w-5" />
                      <span className="text-sm">Gift Cards</span>
                    </Button>
                    <Button 
                      onClick={() => navigate('/referrals')} 
                      variant="outline" 
                      className="h-20 flex-col gap-2 hover-3d-lift"
                    >
                      <Users className="h-5 w-5" />
                      <span className="text-sm">Referrals</span>
                    </Button>
                    <Button 
                      onClick={() => navigate('/cart')} 
                      variant="outline" 
                      className="h-20 flex-col gap-2 hover-3d-lift"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="text-sm">Cart</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
