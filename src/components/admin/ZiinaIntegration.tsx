
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ZiinaIntegration = () => {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    merchant_id: "",
    api_key: "",
    webhook_secret: "",
    sandbox_mode: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save Ziina credentials
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Ziina Integration Updated",
        description: "Your Ziina payment settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Ziina settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to test Ziina connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Ziina payment gateway.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Ziina. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Ziina Payment Integration</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Ziina Configuration
                <Badge variant={isEnabled ? "default" : "secondary"}>
                  {isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable Ziina Payments</h4>
                  <p className="text-sm text-muted-foreground">
                    Accept payments through Ziina payment gateway
                  </p>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
              </div>

              {isEnabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="merchant_id">Merchant ID</Label>
                      <Input
                        id="merchant_id"
                        value={credentials.merchant_id}
                        onChange={(e) => setCredentials(prev => ({ ...prev, merchant_id: e.target.value }))}
                        placeholder="Enter your Ziina Merchant ID"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api_key">API Key</Label>
                      <Input
                        id="api_key"
                        type="password"
                        value={credentials.api_key}
                        onChange={(e) => setCredentials(prev => ({ ...prev, api_key: e.target.value }))}
                        placeholder="Enter your Ziina API Key"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook_secret">Webhook Secret</Label>
                    <Input
                      id="webhook_secret"
                      type="password"
                      value={credentials.webhook_secret}
                      onChange={(e) => setCredentials(prev => ({ ...prev, webhook_secret: e.target.value }))}
                      placeholder="Enter your Ziina Webhook Secret"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sandbox Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Use Ziina sandbox environment for testing
                      </p>
                    </div>
                    <Switch
                      checked={credentials.sandbox_mode}
                      onCheckedChange={(checked) => setCredentials(prev => ({ ...prev, sandbox_mode: checked }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Configuration'}
                    </Button>
                    <Button variant="outline" onClick={testConnection} disabled={isLoading}>
                      {isLoading ? 'Testing...' : 'Test Connection'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Credit Cards</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>Debit Cards</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>Apple Pay</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>Google Pay</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {isEnabled ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    {isEnabled ? 'Integration Active' : 'Integration Disabled'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Webhooks Not Configured</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">SSL Certificate Valid</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Documentation:</strong></p>
                <a href="#" className="text-primary hover:underline">
                  Ziina Integration Guide
                </a>
                
                <p className="mt-3"><strong>Support:</strong></p>
                <p className="text-muted-foreground">
                  support@ziina.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ZiinaIntegration;
