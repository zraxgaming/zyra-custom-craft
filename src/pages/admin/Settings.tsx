
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save, Globe, Mail, Shield, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    // Site Settings
    siteName: "Zyra",
    siteDescription: "Premium custom products and personalization",
    siteUrl: "https://zyra.lovable.app",
    contactEmail: "contact@zyra.com",
    
    // Email Settings
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    
    // Notifications
    orderNotifications: true,
    lowStockAlerts: true,
    newUserNotifications: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: "24",
    passwordPolicy: true,
    
    // Features
    allowGuestCheckout: true,
    enableReviews: true,
    enableWishlist: true,
    enableNewsletter: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "All settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your store settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Site Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="orderNotifications">Order Notifications</Label>
                <Switch
                  id="orderNotifications"
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, orderNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                <Switch
                  id="lowStockAlerts"
                  checked={settings.lowStockAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, lowStockAlerts: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="newUserNotifications">New User Notifications</Label>
                <Switch
                  id="newUserNotifications"
                  checked={settings.newUserNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, newUserNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="passwordPolicy">Strong Password Policy</Label>
                <Switch
                  id="passwordPolicy"
                  checked={settings.passwordPolicy}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, passwordPolicy: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Feature Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in lg:col-span-2" style={{ animationDelay: '600ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Feature Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowGuestCheckout">Allow Guest Checkout</Label>
                    <Switch
                      id="allowGuestCheckout"
                      checked={settings.allowGuestCheckout}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowGuestCheckout: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableReviews">Enable Product Reviews</Label>
                    <Switch
                      id="enableReviews"
                      checked={settings.enableReviews}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableReviews: checked }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableWishlist">Enable Wishlist</Label>
                    <Switch
                      id="enableWishlist"
                      checked={settings.enableWishlist}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableWishlist: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableNewsletter">Enable Newsletter</Label>
                    <Switch
                      id="enableNewsletter"
                      checked={settings.enableNewsletter}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNewsletter: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end animate-fade-in" style={{ animationDelay: '700ms' }}>
          <Button onClick={handleSave} disabled={isLoading} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
