
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Save, Bell, Shield, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const AccountSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    twoFactorAuth: false,
    preferredCurrency: 'USD',
    preferredLanguage: 'en'
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchSettings();
  }, [user, navigate]);

  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setSettings(prev => ({
          ...prev,
          preferredCurrency: profile.preferred_currency || 'USD',
          preferredLanguage: profile.preferred_language || 'en'
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          preferred_currency: settings.preferredCurrency,
          preferred_language: settings.preferredLanguage,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Settings Updated",
        description: "Your account settings have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Settings className="h-10 w-10 text-primary" />
                Account Settings
              </h1>
              <p className="text-muted-foreground text-lg mt-2">Manage your account preferences and security</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Notifications */}
              <Card className="animate-slide-in-left card-premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({...prev, emailNotifications: checked}))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser notifications</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({...prev, pushNotifications: checked}))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Promotional content and offers</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => setSettings(prev => ({...prev, marketingEmails: checked}))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Order Updates</Label>
                      <p className="text-sm text-muted-foreground">Shipping and delivery notifications</p>
                    </div>
                    <Switch
                      checked={settings.orderUpdates}
                      onCheckedChange={(checked) => setSettings(prev => ({...prev, orderUpdates: checked}))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card className="animate-slide-in-right card-premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => setSettings(prev => ({...prev, twoFactorAuth: checked}))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card className="animate-slide-in-up card-premium lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Preferred Currency</Label>
                    <select
                      id="currency"
                      value={settings.preferredCurrency}
                      onChange={(e) => setSettings(prev => ({...prev, preferredCurrency: e.target.value}))}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="AED">AED - UAE Dirham</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <select
                      id="language"
                      value={settings.preferredLanguage}
                      onChange={(e) => setSettings(prev => ({...prev, preferredLanguage: e.target.value}))}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-end animate-slide-in-up">
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="btn-premium px-8"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default AccountSettings;
