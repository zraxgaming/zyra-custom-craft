
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings as SettingsIcon, Save } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface SiteConfig {
  site_name: string;
  site_description: string;
  ziina_api_key: string;
  ziina_base_url: string;
  paypal_client_id: string;
  maintenance_mode: boolean;
  allow_registration: boolean;
}

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<SiteConfig>({
    site_name: '',
    site_description: '',
    ziina_api_key: '',
    ziina_base_url: '',
    paypal_client_id: '',
    maintenance_mode: false,
    allow_registration: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*');

      if (error) throw error;

      const configObj: any = {};
      data?.forEach((item: any) => {
        configObj[item.key] = item.value;
      });

      setConfig({
        site_name: configObj.site_name || '',
        site_description: configObj.site_description || '',
        ziina_api_key: configObj.ziina_api_key || '',
        ziina_base_url: configObj.ziina_base_url || 'https://api.ziina.com',
        paypal_client_id: configObj.paypal_client_id || '',
        maintenance_mode: configObj.maintenance_mode || false,
        allow_registration: configObj.allow_registration !== false,
      });
    } catch (error) {
      console.error('Error fetching config:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update each config value
      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_config')
          .upsert(update, { onConflict: 'key' });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold animate-slide-in-left flex items-center">
            <SettingsIcon className="h-8 w-8 mr-3" />
            Site Settings
          </h1>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="animate-slide-in-right hover:scale-105 transition-transform"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* General Settings */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={config.site_name}
                  onChange={(e) => setConfig(prev => ({ ...prev, site_name: e.target.value }))}
                  placeholder="Zyra Store"
                />
              </div>
              <div>
                <Label htmlFor="site_description">Site Description</Label>
                <Input
                  id="site_description"
                  value={config.site_description}
                  onChange={(e) => setConfig(prev => ({ ...prev, site_description: e.target.value }))}
                  placeholder="Premium e-commerce store"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ziina_api_key">Ziina API Key</Label>
                <Input
                  id="ziina_api_key"
                  type="password"
                  value={config.ziina_api_key}
                  onChange={(e) => setConfig(prev => ({ ...prev, ziina_api_key: e.target.value }))}
                  placeholder="Enter Ziina API key"
                />
              </div>
              <div>
                <Label htmlFor="ziina_base_url">Ziina Base URL</Label>
                <Input
                  id="ziina_base_url"
                  value={config.ziina_base_url}
                  onChange={(e) => setConfig(prev => ({ ...prev, ziina_base_url: e.target.value }))}
                  placeholder="https://api.ziina.com"
                />
              </div>
              <div>
                <Label htmlFor="paypal_client_id">PayPal Client ID</Label>
                <Input
                  id="paypal_client_id"
                  value={config.paypal_client_id}
                  onChange={(e) => setConfig(prev => ({ ...prev, paypal_client_id: e.target.value }))}
                  placeholder="Enter PayPal Client ID"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="animate-scale-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable to put the site in maintenance mode
                  </p>
                </div>
                <Switch
                  id="maintenance_mode"
                  checked={config.maintenance_mode}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, maintenance_mode: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow_registration">Allow Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register accounts
                  </p>
                </div>
                <Switch
                  id="allow_registration"
                  checked={config.allow_registration}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, allow_registration: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
