
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useToast } from "@/hooks/use-toast";
import { Save, Settings } from "lucide-react";

const GeneralSettings = () => {
  const { config, isLoading, updateConfig } = useSiteConfig();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    site_name: config?.site_name || "",
    site_description: config?.site_description || "",
    contact_email: config?.contact_email || "",
    support_phone: config?.support_phone || "",
    address: config?.address || "",
    business_hours: config?.business_hours || "",
    newsletter_enabled: config?.newsletter_enabled || false,
    abandoned_cart_enabled: config?.abandoned_cart_enabled || false,
  });

  React.useEffect(() => {
    if (config) {
      setFormData({
        site_name: config.site_name || "",
        site_description: config.site_description || "",
        contact_email: config.contact_email || "",
        support_phone: config.support_phone || "",
        address: config.address || "",
        business_hours: config.business_hours || "",
        newsletter_enabled: config.newsletter_enabled || false,
        abandoned_cart_enabled: config.abandoned_cart_enabled || false,
      });
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      for (const [key, value] of Object.entries(formData)) {
        await updateConfig(key, value);
      }
      
      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">General Settings</h2>
      </div>

      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value }))}
                  placeholder="Your Site Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="contact@yoursite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support_phone">Support Phone</Label>
                <Input
                  id="support_phone"
                  value={formData.support_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, support_phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_hours">Business Hours</Label>
                <Input
                  id="business_hours"
                  value={formData.business_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_hours: e.target.value }))}
                  placeholder="Mon-Fri: 9AM-5PM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                value={formData.site_description}
                onChange={(e) => setFormData(prev => ({ ...prev, site_description: e.target.value }))}
                placeholder="A brief description of your site"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Business St, City, State 12345"
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newsletter_enabled">Newsletter</Label>
                  <p className="text-sm text-muted-foreground">Enable newsletter subscriptions</p>
                </div>
                <Switch
                  id="newsletter_enabled"
                  checked={formData.newsletter_enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter_enabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="abandoned_cart_enabled">Abandoned Cart Recovery</Label>
                  <p className="text-sm text-muted-foreground">Send emails for abandoned carts</p>
                </div>
                <Switch
                  id="abandoned_cart_enabled"
                  checked={formData.abandoned_cart_enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, abandoned_cart_enabled: checked }))}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
