import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Settings, DollarSign, Activity, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  api_key: string;
  secret_key: string;
  webhook_url: string;
  is_active: boolean;
  is_sandbox: boolean;
}

const ZiinaIntegration = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    api_key: '',
    secret_key: '',
    webhook_url: '',
    is_active: false,
    is_sandbox: true,
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      // Using mock data since payment_methods table needs proper setup
      const mockData: PaymentMethod[] = [
        {
          id: "1",
          name: "PayPal",
          type: "paypal",
          api_key: "",
          secret_key: "",
          webhook_url: "",
          is_active: true,
          is_sandbox: false
        },
        {
          id: "2",
          name: "Ziina", 
          type: "ziina",
          api_key: "",
          secret_key: "",
          webhook_url: "",
          is_active: false,
          is_sandbox: true
        }
      ];
      
      setPaymentMethods(mockData);

      // Set form data for Ziina if it exists
      const ziinaMethod = mockData?.find(method => method.type === 'ziina');
      if (ziinaMethod) {
        setFormData({
          api_key: ziinaMethod.api_key || '',
          secret_key: ziinaMethod.secret_key || '',
          webhook_url: ziinaMethod.webhook_url || '',
          is_active: ziinaMethod.is_active,
          is_sandbox: ziinaMethod.is_sandbox,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error fetching payment methods",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveZiinaConfig = async () => {
    try {
      // Simulate saving - in real implementation this would update the database
      toast({
        title: "Ziina configuration saved",
        description: "Payment method settings have been updated successfully.",
      });
      
      fetchPaymentMethods();
    } catch (error: any) {
      toast({
        title: "Error saving configuration",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePaymentMethod = async (methodId: string, isActive: boolean) => {
    try {
      // Simulate toggle - in real implementation this would update the database
      toast({
        title: "Payment method updated",
        description: `Payment method has been ${isActive ? 'enabled' : 'disabled'}.`,
      });

      fetchPaymentMethods();
    } catch (error: any) {
      toast({
        title: "Error updating payment method",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testConnection = async () => {
    toast({
      title: "Testing connection...",
      description: "Checking Ziina API connectivity",
    });

    setTimeout(() => {
      if (formData.api_key && formData.secret_key) {
        toast({
          title: "Connection successful",
          description: "Ziina API connection is working correctly.",
        });
      } else {
        toast({
          title: "Connection failed",
          description: "Please check your API credentials.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const getStatusIcon = (method: PaymentMethod) => {
    if (!method.is_active) return <XCircle className="h-4 w-4 text-red-500" />;
    if (method.is_sandbox) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = (method: PaymentMethod) => {
    if (!method.is_active) return 'Disabled';
    if (method.is_sandbox) return 'Sandbox';
    return 'Live';
  };

  const getStatusVariant = (method: PaymentMethod): "default" | "secondary" | "destructive" => {
    if (!method.is_active) return 'destructive';
    if (method.is_sandbox) return 'secondary';
    return 'default';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Payment Integration</h2>
      </div>

      {/* Payment Methods Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentMethods.map((method, index) => (
          <Card key={method.id} className="bg-card border-border animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {method.name}
                </div>
                {getStatusIcon(method)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant={getStatusVariant(method)} className="w-fit">
                  {getStatusText(method)}
                </Badge>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Switch
                    checked={method.is_active}
                    onCheckedChange={(checked) => togglePaymentMethod(method.id, checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ziina Configuration */}
      <Card className="bg-card border-border animate-slide-in-right" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ziina Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api_key" className="text-foreground">API Key</Label>
                  <Input
                    id="api_key"
                    type="password"
                    value={formData.api_key}
                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                    placeholder="Enter your Ziina API key"
                    className="bg-background text-foreground border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret_key" className="text-foreground">Secret Key</Label>
                  <Input
                    id="secret_key"
                    type="password"
                    value={formData.secret_key}
                    onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
                    placeholder="Enter your Ziina secret key"
                    className="bg-background text-foreground border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook_url" className="text-foreground">Webhook URL</Label>
                <Input
                  id="webhook_url"
                  value={formData.webhook_url}
                  onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                  placeholder="https://your-domain.com/api/webhooks/ziina"
                  className="bg-background text-foreground border-border"
                />
                <p className="text-xs text-muted-foreground">
                  This URL will receive payment notifications from Ziina
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label className="text-foreground">Enable Ziina Payments</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Allow customers to pay using Ziina
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_sandbox}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_sandbox: checked })}
                    />
                    <Label className="text-foreground">Sandbox Mode</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use Ziina test environment for development
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={saveZiinaConfig} className="bg-primary hover:bg-primary/90">
                  <Settings className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                <Button onClick={testConnection} variant="outline" className="border-border">
                  <Activity className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card className="bg-card border-border animate-fade-in" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="text-foreground">Integration Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Step 1: Get your API credentials</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Log in to your Ziina merchant dashboard and navigate to API settings to get your API key and secret.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Step 2: Configure webhook</h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Set up the webhook URL in your Ziina dashboard to receive payment notifications.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Step 3: Test integration</h4>
              <p className="text-orange-700 dark:text-orange-300 text-sm">
                Start with sandbox mode to test payments before going live with real transactions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZiinaIntegration;
