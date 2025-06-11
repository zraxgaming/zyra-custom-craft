
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Package, Gift, Users, MapPin, Phone, Mail, Edit, Save, X } from 'lucide-react';
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
}

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  initial_amount: number;
  created_at: string;
  is_active: boolean;
}

interface Referral {
  id: string;
  referral_code: string;
  status: string;
  reward_earned: boolean;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
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
      fetchProfile();
      fetchOrders();
      fetchGiftCards();
      fetchReferrals();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at, payment_method')
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
        .select('id, code, amount, initial_amount, created_at, is_active')
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
        .select('id, referral_code, status, reward_earned, created_at')
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

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md animate-scale-in-professional">
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-primary animate-gentle-pulse" />
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
          <div className="animate-loading-spinner rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          <div className="text-center mb-8 animate-fade-in-elegant">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your account and view your activity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <Card className="lg:col-span-1 card-professional animate-slide-in-smooth">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-xl">
                      {profile?.first_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : profile?.display_name || 'User'
                      }
                    </h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <Badge variant="outline" className="mt-1">
                      {profile?.role || 'user'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!editing ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      {profile?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Member since {new Date(profile?.created_at || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setEditing(true)} 
                      variant="outline" 
                      className="w-full hover-lift-subtle"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={formData.display_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile} className="flex-1 btn-professional">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={() => setEditing(false)} variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-2 animate-slide-in-smooth" style={{ animationDelay: '0.1s' }}>
              <Tabs defaultValue="orders" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="orders" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="giftcards" className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Gift Cards
                  </TabsTrigger>
                  <TabsTrigger value="referrals" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Referrals
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="orders">
                  <Card className="card-professional">
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {orders.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-gentle-pulse" />
                          <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                          <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                          <Button asChild className="btn-professional">
                            <a href="/shop">Browse Products</a>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 stagger-children">
                          {orders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover-lift-subtle">
                              <div>
                                <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                                <Badge variant="outline" className="mt-1">
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">${order.total_amount}</p>
                                <p className="text-sm text-muted-foreground">{order.payment_method}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="giftcards">
                  <Card className="card-professional">
                    <CardHeader>
                      <CardTitle>Your Gift Cards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {giftCards.length === 0 ? (
                        <div className="text-center py-8">
                          <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-gentle-pulse" />
                          <h3 className="text-lg font-semibold mb-2">No Gift Cards</h3>
                          <p className="text-muted-foreground mb-4">Purchase gift cards for yourself or others</p>
                          <Button asChild className="btn-professional">
                            <a href="/gift-cards">Buy Gift Card</a>
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
                          {giftCards.map((giftCard) => (
                            <div key={giftCard.id} className="p-4 border rounded-lg hover-lift-subtle">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant={giftCard.is_active ? "default" : "secondary"}>
                                  {giftCard.is_active ? "Active" : "Used"}
                                </Badge>
                                <span className="text-lg font-bold">${giftCard.amount}</span>
                              </div>
                              <p className="font-mono text-sm">{giftCard.code}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Created {new Date(giftCard.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="referrals">
                  <Card className="card-professional">
                    <CardHeader>
                      <CardTitle>Referral Program</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {referrals.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-gentle-pulse" />
                          <h3 className="text-lg font-semibold mb-2">No Referrals Yet</h3>
                          <p className="text-muted-foreground mb-4">Invite friends and earn rewards</p>
                          <Button className="btn-professional">
                            <Users className="h-4 w-4 mr-2" />
                            Start Referring
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 stagger-children">
                          {referrals.map((referral) => (
                            <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg hover-lift-subtle">
                              <div>
                                <p className="font-semibold">{referral.referral_code}</p>
                                <p className="text-sm text-muted-foreground">
                                  Created {new Date(referral.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant={referral.reward_earned ? "default" : "secondary"}>
                                  {referral.status}
                                </Badge>
                                {referral.reward_earned && (
                                  <p className="text-sm text-green-600">Reward Earned!</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Profile;
