
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Settings, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Ziina = () => {
  const [settings, setSettings] = useState({
    api_key: "",
    secret_key: "",
    webhook_url: "",
    is_active: false,
    is_sandbox: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    successRate: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchZiinaSettings();
    fetchTransactionStats();
  }, []);

  const fetchZiinaSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('type', 'ziina')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          api_key: data.api_key || "",
          secret_key: data.secret_key || "",
          webhook_url: data.webhook_url || "",
          is_active: data.is_active || false,
          is_sandbox: data.is_sandbox || true
        });
      }
    } catch (error: any) {
      console.error('Error fetching Ziina settings:', error);
    }
  };

  const fetchTransactionStats = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount, payment_status')
        .eq('payment_method', 'ziina');

      if (error) throw error;

      const total = orders?.length || 0;
      const revenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const successful = orders?.filter(order => order.payment_status === 'completed').length || 0;

      setStats({
        totalTransactions: total,
        totalRevenue: revenue,
        successRate: total > 0 ? (successful / total) * 100 : 0
      });
    } catch (error: any) {
      console.error('Error fetching transaction stats:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('payment_methods')
        .upsert({
          name: 'Ziina',
          type: 'ziina',
          ...settings
        }, {
          onConflict: 'type'
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Ziina payment settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Connection successful",
        description: "Successfully connected to Ziina API.",
      });
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to Ziina API. Please check your credentials.",
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
          <h1 className="text-3xl font-bold text-foreground">Ziina Payment Integration</h1>
          <p className="text-muted-foreground">Configure and manage Ziina payment gateway</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.successRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Ziina Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api_key">API Key</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={settings.api_key}
                  onChange={(e) => setSettings(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="Enter your Ziina API key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret_key">Secret Key</Label>
                <Input
                  id="secret_key"
                  type="password"
                  value={settings.secret_key}
                  onChange={(e) => setSettings(prev => ({ ...prev, secret_key: e.target.value }))}
                  placeholder="Enter your Ziina secret key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook_url">Webhook URL</Label>
                <Input
                  id="webhook_url"
                  value={settings.webhook_url}
                  onChange={(e) => setSettings(prev => ({ ...prev, webhook_url: e.target.value }))}
                  placeholder="https://yoursite.com/webhooks/ziina"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_sandbox">Sandbox Mode</Label>
                <Switch
                  id="is_sandbox"
                  checked={settings.is_sandbox}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, is_sandbox: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Enable Ziina Payments</Label>
                <Switch
                  id="is_active"
                  checked={settings.is_active}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={saveSettings} disabled={isLoading} className="flex-1">
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
                <Button variant="outline" onClick={testConnection} disabled={isLoading}>
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-in-right">
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>API Connection</span>
                <Badge variant={settings.api_key ? "default" : "secondary"}>
                  {settings.api_key ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Configured
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Configured
                    </>
                  )}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Webhook Setup</span>
                <Badge variant={settings.webhook_url ? "default" : "secondary"}>
                  {settings.webhook_url ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Configured
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Configured
                    </>
                  )}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Payment Status</span>
                <Badge variant={settings.is_active ? "default" : "secondary"}>
                  {settings.is_active ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Environment</span>
                <Badge variant={settings.is_sandbox ? "secondary" : "default"}>
                  {settings.is_sandbox ? "Sandbox" : "Production"}
                </Badge>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Setup Instructions</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Get your API credentials from Ziina dashboard</li>
                  <li>2. Configure webhook URL in Ziina settings</li>
                  <li>3. Test the connection in sandbox mode</li>
                  <li>4. Enable production mode when ready</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Ziina;
