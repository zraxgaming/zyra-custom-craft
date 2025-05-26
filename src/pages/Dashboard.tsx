
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReferralDashboard from "@/components/referrals/ReferralDashboard";
import UserAnalytics from "@/components/analytics/UserAnalytics";
import { User, BarChart3, Users, ShoppingBag, Heart } from "lucide-react";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    display_name: "",
  });
  const [orders, setOrders] = useState([]);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || user?.email || "",
          phone: data.phone || "",
          display_name: data.display_name || "",
        });
      } else {
        setProfile(prev => ({
          ...prev,
          email: user?.email || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (name, images)
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...profile,
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-12 animate-fade-in">
        <Container>
          <div className="mb-8 animate-scale-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome back, {user.user_metadata?.first_name || 'User'}!
            </h1>
            <p className="text-muted-foreground">Manage your account, track your orders, and view your activity.</p>
          </div>

          <Tabs defaultValue="profile" className="w-full animate-slide-in-right">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                <ShoppingBag className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                <Users className="h-4 w-4" />
                Referrals
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6 animate-fade-in">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isProfileLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 animate-fade-in">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            value={profile.first_name}
                            onChange={(e) =>
                              setProfile({ ...profile, first_name: e.target.value })
                            }
                            className="focus:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            value={profile.last_name}
                            onChange={(e) =>
                              setProfile({ ...profile, last_name: e.target.value })
                            }
                            className="focus:scale-105 transition-transform duration-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                          id="display_name"
                          value={profile.display_name}
                          onChange={(e) =>
                            setProfile({ ...profile, display_name: e.target.value })
                          }
                          className="focus:scale-105 transition-transform duration-200"
                        />
                      </div>

                      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          disabled
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="focus:scale-105 transition-transform duration-200"
                        />
                      </div>

                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="w-full md:w-auto hover:scale-105 transition-transform duration-200 animate-fade-in"
                        style={{ animationDelay: '0.5s' }}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6 animate-fade-in">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8 animate-bounce-in">
                      <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
                      <p className="text-muted-foreground">Start shopping to see your orders here!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order: any, index) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold">
                                Order #{order.id.slice(0, 8)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ${order.total_amount.toFixed(2)}
                              </p>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs transition-all duration-300 hover:scale-110 ${
                                  order.status === "delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "shipped"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="space-y-2">
                            {order.order_items?.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-4 hover:bg-muted/50 p-2 rounded transition-colors duration-200">
                                {item.products?.images?.[0] && (
                                  <img
                                    src={item.products.images[0]}
                                    alt={item.products.name}
                                    className="w-12 h-12 object-cover rounded hover:scale-110 transition-transform duration-200"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium">{item.products?.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6 animate-fade-in">
              <UserAnalytics />
            </TabsContent>
            
            <TabsContent value="referrals" className="space-y-6 animate-fade-in">
              <ReferralDashboard />
            </TabsContent>
          </Tabs>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
