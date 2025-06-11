
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
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
  Copy,
  Eye,
  Mail,
  Calendar,
  DollarSign,
  Award,
  Sparkles
} from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [profile, setProfile] = useState({
    display_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    country: 'UAE'
  });

  useEffect(() => {
    if (!user) return;
    fetchUserData();
    generateReferralCode();
  }, [user]);

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
          email: profileData.email || user.email || '',
          address: profileData.address || '',
          city: profileData.city || '',
          country: profileData.country || 'UAE'
        });
      }

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product:products (name, images)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setOrders(ordersData || []);

      // Fetch gift cards
      const { data: giftCardsData } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setGiftCards(giftCardsData || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const generateReferralCode = () => {
    if (user?.id) {
      const code = `ZYRA${user.id.slice(-8).toUpperCase()}`;
      setReferralCode(code);
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

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="animate-scale-in">
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
              <p className="text-muted-foreground">You need to be signed in to view your profile.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="My Profile - Zyra Custom Craft"
        description="Manage your account, view orders, gift cards, and referrals at Zyra Custom Craft."
        url="https://shopzyra.vercel.app/profile"
        keywords="profile, account, orders, gift cards, referrals, zyra"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-950 dark:via-blue-950 dark:to-pink-950 py-8">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold animate-pulse-glow">
                  {profile.first_name?.[0] || user.email?.[0] || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer">
                Welcome, {profile.first_name || 'Valued Customer'}!
              </h1>
              <p className="text-muted-foreground text-lg">Manage your account and track your orders</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border animate-slide-in-up">
                <TabsTrigger value="profile" className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-300">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-300">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="giftcards" className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-300">
                  <Gift className="h-4 w-4" />
                  <span className="hidden sm:inline">Gift Cards</span>
                </TabsTrigger>
                <TabsTrigger value="referrals" className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-300">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Referrals</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-300">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
                <TabsTrigger value="signout" className="flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-300">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="animate-fade-in">
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl animate-scale-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <User className="h-6 w-6 text-primary" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); updateProfile(); }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="animate-slide-in-left">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            value={profile.first_name}
                            onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                            className="mt-1 transition-all duration-300 focus:scale-105"
                          />
                        </div>
                        <div className="animate-slide-in-right">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            value={profile.last_name}
                            onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                            className="mt-1 transition-all duration-300 focus:scale-105"
                          />
                        </div>
                      </div>

                      <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="mt-1 bg-gray-100 dark:bg-gray-800"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Email cannot be changed from this page
                        </p>
                      </div>

                      <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="mt-1 transition-all duration-300 focus:scale-105"
                        />
                      </div>

                      <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profile.address}
                          onChange={(e) => setProfile({...profile, address: e.target.value})}
                          className="mt-1 transition-all duration-300 focus:scale-105"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="animate-slide-in-left" style={{animationDelay: '0.5s'}}>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={profile.city}
                            onChange={(e) => setProfile({...profile, city: e.target.value})}
                            className="mt-1 transition-all duration-300 focus:scale-105"
                          />
                        </div>
                        <div className="animate-slide-in-right" style={{animationDelay: '0.5s'}}>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={profile.country}
                            onChange={(e) => setProfile({...profile, country: e.target.value})}
                            className="mt-1 transition-all duration-300 focus:scale-105"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 hover:scale-105 animate-bounce-in"
                        style={{animationDelay: '0.6s'}}
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="animate-fade-in">
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl animate-scale-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Package className="h-6 w-6 text-primary" />
                      Order History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-12 animate-fade-in">
                        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-bounce" />
                        <p className="text-muted-foreground text-lg">No orders yet</p>
                        <p className="text-sm text-muted-foreground">Start shopping to see your orders here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order: any, index: number) => (
                          <div 
                            key={order.id} 
                            className="p-4 border rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up"
                            style={{animationDelay: `${index * 100}ms`}}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold">Order #{order.id.slice(-8)}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-lg font-bold text-primary">${order.total_amount.toFixed(2)}</p>
                            {order.order_items && order.order_items.length > 0 && (
                              <p className="text-sm text-muted-foreground">
                                {order.order_items.length} item(s)
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="giftcards" className="animate-fade-in">
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl animate-scale-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Gift className="h-6 w-6 text-primary" />
                      My Gift Cards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {giftCards.length === 0 ? (
                      <div className="text-center py-12 animate-fade-in">
                        <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-bounce" />
                        <p className="text-muted-foreground text-lg">No gift cards</p>
                        <p className="text-sm text-muted-foreground">Purchase gift cards to see them here</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {giftCards.map((card: any, index: number) => (
                          <div 
                            key={card.id}
                            className="p-6 border rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up"
                            style={{animationDelay: `${index * 100}ms`}}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-lg">Gift Card</h4>
                                <p className="text-sm text-muted-foreground">{card.code}</p>
                                <p className="text-2xl font-bold text-primary">${card.amount.toFixed(2)}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(card.code);
                                  toast({ title: "Code copied!" });
                                }}
                                className="hover:scale-110 transition-transform"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="referrals" className="animate-fade-in">
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl animate-scale-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Users className="h-6 w-6 text-primary" />
                      Referral Program
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg animate-pulse-glow">
                      <Award className="h-12 w-12 mx-auto mb-4 text-primary animate-bounce" />
                      <h3 className="text-xl font-bold mb-2">Invite Friends & Earn Rewards!</h3>
                      <p className="text-muted-foreground mb-4">Share your referral code and get 10% commission for every purchase</p>
                      
                      <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <code className="text-lg font-mono font-bold text-primary">{referralCode}</code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyReferralCode}
                          className="hover:scale-110 transition-transform"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg animate-fade-in">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold">$0.00</p>
                        <p className="text-sm text-muted-foreground">Total Earned</p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg animate-fade-in" style={{animationDelay: '0.2s'}}>
                        <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold">{referralCount}</p>
                        <p className="text-sm text-muted-foreground">Referrals</p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg animate-fade-in" style={{animationDelay: '0.4s'}}>
                        <Gift className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <p className="text-2xl font-bold">10%</p>
                        <p className="text-sm text-muted-foreground">Commission</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="animate-fade-in">
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl animate-scale-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Settings className="h-6 w-6 text-primary" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg animate-slide-in-left">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg animate-slide-in-right">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">Payment Methods</h4>
                            <p className="text-sm text-muted-foreground">Manage your payment options</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg animate-slide-in-left">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">Shipping Addresses</h4>
                            <p className="text-sm text-muted-foreground">Manage delivery addresses</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="signout" className="animate-fade-in">
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl animate-scale-in">
                  <CardContent className="p-8 text-center">
                    <LogOut className="h-16 w-16 mx-auto mb-4 text-red-500 animate-shake" />
                    <h3 className="text-2xl font-bold mb-2">Sign Out</h3>
                    <p className="text-muted-foreground mb-6">Are you sure you want to sign out of your account?</p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => window.location.hash = '#profile'}
                        className="hover:scale-105 transition-transform"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={signOut}
                        className="hover:scale-105 transition-transform"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
