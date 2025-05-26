
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const GeneralSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    site_name: "Zyra",
    site_description: "Premium E-commerce Platform",
    contact_email: "hello@zyra.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
    maintenance_mode: false,
    allow_registration: true,
    store_open: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save general settings to site_config table
      const configEntries = Object.entries(settings).map(([key, value]) => ({
        key,
        value: { data: value },
        updated_at: new Date().toISOString()
      }));

      for (const entry of configEntries) {
        const { error } = await supabase
          .from('site_config')
          .upsert(entry, { onConflict: 'key' });
        
        if (error) throw error;
      }

      toast({
        title: "Settings saved",
        description: "General settings have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name</Label>
            <Input
              id="site_name"
              value={settings.site_name}
              onChange={(e) => updateSetting('site_name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={settings.contact_email}
              onChange={(e) => updateSetting('contact_email', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="site_description">Site Description</Label>
          <Textarea
            id="site_description"
            value={settings.site_description}
            onChange={(e) => updateSetting('site_description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => updateSetting('phone', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => updateSetting('address', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Store Settings</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Store Status</h4>
              <p className="text-sm text-muted-foreground">
                Allow customers to place orders
              </p>
            </div>
            <Switch
              checked={settings.store_open}
              onCheckedChange={(checked) => updateSetting('store_open', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">User Registration</h4>
              <p className="text-sm text-muted-foreground">
                Allow new users to register accounts
              </p>
            </div>
            <Switch
              checked={settings.allow_registration}
              onCheckedChange={(checked) => updateSetting('allow_registration', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Maintenance Mode</h4>
              <p className="text-sm text-muted-foreground">
                Temporarily disable the store for maintenance
              </p>
            </div>
            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
