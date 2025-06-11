
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Package, 
  Gift, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Edit, 
  Save, 
  X, 
  Settings,
  CreditCard,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  role: string;
  created_at: string;
  updated_at: string;
  display_name: string;
  username: string;
  preferred_currency: string;
  preferred_language: string;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_method: string;
  currency: string;
  delivery_type: string;
}

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  initial_amount: number;
  created_at: string;
  is_active: boolean;
  expires_at: string;
  recipient_email: string;
  message: string;
}

interface Referral {
  id: string;
  referral_code: string;
  status: string;
  reward_earned: boolean;
  created_at: string;
}

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    display_name: ''
  });

  useEffect(() => {
    if (user) {
      // Show fake loading for 1 second
      setLoading(true);
      setTimeout(() => {
        fetchProfile();
        fetchOrders();
        fetchGiftCards();
        fetchReferrals();
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        display_name: data.display_name || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at, payment_method, currency, delivery_type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchGiftCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGiftCards(data || []);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
    }
  };

  const fetchReferrals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          display_name: formData.display_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });

      setEditing(false);
      await fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md animate-fade-in-elegant">
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to view your profile
              </p>
              <Button asChild className="w-full btn-professional">
                <a href="/auth">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="My Profile - Zyra Custom Craft"
        description="Manage your profile, view orders, gift cards, and referrals on Zyra Custom Craft."
        keywords="profile, account, orders, gift cards, referrals"
      />
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-elegant">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your account and view your activity
            </p>
          </div>

          {/* Admin Panel Button */}
          {isAdmin && (
            <div className="text-center mb-6">
              <Button asChild className="btn-professional">
                <a href="/admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </a>
              </Button>
            </div>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 animate-slide-in-smooth">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="giftcards">Gift Cards</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in-elegant">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-professional">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{orders.length}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>

                <Card className="card-professional">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gift Cards</CardTitle>
                    <Gift className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{giftCards.length}</div>
                    <p className="text-xs text-muted-foreground">Purchased</p>
                  </CardContent>
                </Card>

                <Card className="card-professional">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{referrals.length}</div>
                    <p className="text-xs text-muted-foreground">Friends referred</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover-lift-subtle">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total_amount} {order.currency}</p>
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
                      <p className="text-muted-foreground">No orders yet</p>
                      <Button className="mt-4" asChild>
                        <a href="/shop">Start Shopping</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="animate-fade-in-elegant">
              <Card className="card-professional">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editing ? setEditing(false) : setEditing(true)}
                      className="interactive-element"
                    >
                      {editing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      {editing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {profile?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {profile?.display_name || `${profile?.first_name} ${profile?.last_name}` || 'User'}
                      </h3>
                      <p className="text-muted-foreground">{user.email}</p>
                      {profile?.role && (
                        <Badge variant="secondary" className="mt-1">
                          {profile.role}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        disabled={!editing}
                        className="focus-professional"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        disabled={!editing}
                        className="focus-professional"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={formData.display_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                      disabled={!editing}
                      className="focus-professional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editing}
                      className="focus-professional"
                    />
                  </div>

                  {editing && (
                    <Button onClick={handleUpdateProfile} className="btn-professional">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="animate-fade-in-elegant">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover-lift-subtle">
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
                              <Button variant="outline" size="sm" className="interactive-element">
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

            {/* Gift Cards Tab */}
            <TabsContent value="giftcards" className="animate-fade-in-elegant">
              <Card className="card-professional">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Gift Cards</CardTitle>
                    <Button asChild className="btn-professional">
                      <a href="/gift-cards">
                        <Gift className="h-4 w-4 mr-2" />
                        Buy Gift Card
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {giftCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {giftCards.map((giftCard) => (
                        <div key={giftCard.id} className="p-4 border rounded-lg hover-lift-subtle">
                          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg mb-4">
                            <p className="text-sm text-muted-foreground mb-1">Gift Card Code</p>
                            <p className="text-lg font-mono font-bold">{giftCard.code}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Balance:</span>
                              <span className="font-semibold">${giftCard.amount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Status:</span>
                              <Badge variant={giftCard.is_active ? "default" : "secondary"}>
                                {giftCard.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Created:</span>
                              <span className="text-sm">{new Date(giftCard.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-muted-foreground">No gift cards found</p>
                      <Button className="mt-4" asChild>
                        <a href="/gift-cards">Purchase Gift Card</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Referrals Tab */}
            <TabsContent value="referrals" className="animate-fade-in-elegant">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle>Referral Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Refer Friends & Earn Rewards</h3>
                    <p className="text-muted-foreground mb-6">
                      Share your unique referral code and earn credits when your friends make their first purchase.
                    </p>
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
                        <p className="font-mono text-lg font-bold">USER{user.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <Button className="w-full btn-professional">
                        <Users className="mr-2 h-4 w-4" />
                        Share Referral Code
                      </Button>
                    </div>
                    
                    {referrals.length > 0 && (
                      <div className="mt-8">
                        <h4 className="font-medium mb-4">Your Referrals</h4>
                        <div className="space-y-2">
                          {referrals.map((referral) => (
                            <div key={referral.id} className="flex justify-between items-center p-3 border rounded">
                              <span className="font-mono text-sm">{referral.referral_code}</span>
                              <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                                {referral.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Profile;
