
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, CreditCard, Shield, Globe } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  api_key: string;
  secret_key: string;
  webhook_url: string;
  is_active: boolean;
  is_sandbox: boolean;
}

const Ziina = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<PaymentMethod>({
    id: '',
    name: 'Ziina',
    api_key: '',
    secret_key: '',
    webhook_url: '',
    is_active: true,
    is_sandbox: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load existing configuration (mock data for now)
    const mockConfig = {
      id: '1',
      name: 'Ziina',
      api_key: '',
      secret_key: '',
      webhook_url: 'https://yourapp.com/webhooks/ziina',
      is_active: true,
      is_sandbox: true
    };
    setConfig(mockConfig);
    setIsLoading(false);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Ziina payment configuration has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      // Mock test connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Connection successful",
        description: "Successfully connected to Ziina API.",
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to Ziina API. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ziina Payment Gateway</h1>
          <p className="text-muted-foreground">Configure your Ziina payment integration</p>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api_key">API Key</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={config.api_key}
                  onChange={(e) => setConfig(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="Enter your Ziina API key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret_key">Secret Key</Label>
                <Input
                  id="secret_key"
                  type="password"
                  value={config.secret_key}
                  onChange={(e) => setConfig(prev => ({ ...prev, secret_key: e.target.value }))}
                  placeholder="Enter your Ziina secret key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook_url">Webhook URL</Label>
                <Input
                  id="webhook_url"
                  value={config.webhook_url}
                  onChange={(e) => setConfig(prev => ({ ...prev, webhook_url: e.target.value }))}
                  placeholder="https://yourapp.com/webhooks/ziina"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Sandbox Mode</Label>
                  <p className="text-sm text-muted-foreground">Use test environment for development</p>
                </div>
                <Switch
                  checked={config.is_sandbox}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, is_sandbox: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Enable Ziina Payments</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to pay using Ziina</p>
                </div>
                <Switch
                  checked={config.is_active}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Webhook Security</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Ziina will send payment notifications to your webhook URL. Make sure your endpoint can handle POST requests.
                </p>
                <code className="text-xs bg-background p-2 rounded block">
                  POST {config.webhook_url}
                </code>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">IP Whitelist</h4>
                <p className="text-sm text-muted-foreground">
                  For added security, whitelist these Ziina IP addresses in your firewall:
                </p>
                <ul className="text-xs font-mono mt-2 space-y-1">
                  <li>• 203.0.113.1</li>
                  <li>• 203.0.113.2</li>
                  <li>• 203.0.113.3</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="animate-scale-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? "Saving..." : "Save Configuration"}
              </Button>
              
              <Button variant="outline" onClick={handleTestConnection} className="w-full">
                Test Connection
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <a href="https://docs.ziina.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Ziina Documentation
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection Status</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  config.api_key && config.secret_key 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {config.api_key && config.secret_key ? 'Connected' : 'Not Configured'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Environment</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  config.is_sandbox 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {config.is_sandbox ? 'Sandbox' : 'Production'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Gateway</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  config.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {config.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Ziina;
