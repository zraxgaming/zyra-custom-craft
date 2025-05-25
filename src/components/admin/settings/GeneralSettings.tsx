
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Settings, Mail, Bell, Globe, Key, CreditCard } from "lucide-react";

const GeneralSettings = () => {
  const { config, updateConfig, isLoading } = useSiteConfig();
  const { toast } = useToast();
  const [localConfig, setLocalConfig] = useState(config);

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSave = async (key: string, value: any) => {
    await updateConfig(key, value);
  };

  const handleInputChange = (key: string, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Site Configuration */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Site Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name</Label>
            <Input
              id="site_name"
              value={localConfig.site_name || ""}
              onChange={(e) => handleInputChange("site_name", e.target.value)}
              placeholder="Enter your site name"
              className="transition-all duration-200 focus:scale-105"
            />
            <Button 
              onClick={() => handleSave("site_name", localConfig.site_name)}
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              Save Site Name
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={localConfig.contact_email || ""}
              onChange={(e) => handleInputChange("contact_email", e.target.value)}
              placeholder="contact@yoursite.com"
              className="transition-all duration-200 focus:scale-105"
            />
            <Button 
              onClick={() => handleSave("contact_email", localConfig.contact_email)}
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              Save Contact Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Configuration */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            API Keys Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brevo_api_key">Brevo API Key</Label>
            <Input
              id="brevo_api_key"
              type="password"
              value={localConfig.brevo_api_key || ""}
              onChange={(e) => handleInputChange("brevo_api_key", e.target.value)}
              placeholder="Enter your Brevo API key"
              className="transition-all duration-200 focus:scale-105"
            />
            <Button 
              onClick={() => handleSave("brevo_api_key", localConfig.brevo_api_key)}
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              Save Brevo API Key
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ziina_api_key">Ziina API Key</Label>
            <Input
              id="ziina_api_key"
              type="password"
              value={localConfig.ziina_api_key || ""}
              onChange={(e) => handleInputChange("ziina_api_key", e.target.value)}
              placeholder="Enter your Ziina API key"
              className="transition-all duration-200 focus:scale-105"
            />
            <Button 
              onClick={() => handleSave("ziina_api_key", localConfig.ziina_api_key)}
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              Save Ziina API Key
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypal_client_id">PayPal Client ID</Label>
            <Input
              id="paypal_client_id"
              value={localConfig.paypal_client_id || ""}
              onChange={(e) => handleInputChange("paypal_client_id", e.target.value)}
              placeholder="Enter your PayPal Client ID"
              className="transition-all duration-200 focus:scale-105"
            />
            <Button 
              onClick={() => handleSave("paypal_client_id", localConfig.paypal_client_id)}
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
            >
              Save PayPal Client ID
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Enable general email notifications
              </p>
            </div>
            <Switch
              checked={localConfig.notifications_enabled || false}
              onCheckedChange={(checked) => {
                handleInputChange("notifications_enabled", checked);
                handleSave("notifications_enabled", checked);
              }}
              className="transition-all duration-200 hover:scale-110"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Abandoned Cart Emails</Label>
              <p className="text-sm text-muted-foreground">
                Send emails to users who abandon their cart
              </p>
            </div>
            <Switch
              checked={localConfig.abandoned_cart_enabled || false}
              onCheckedChange={(checked) => {
                handleInputChange("abandoned_cart_enabled", checked);
                handleSave("abandoned_cart_enabled", checked);
              }}
              className="transition-all duration-200 hover:scale-110"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Newsletter System</Label>
              <p className="text-sm text-muted-foreground">
                Enable newsletter subscription and sending
              </p>
            </div>
            <Switch
              checked={localConfig.newsletter_enabled || false}
              onCheckedChange={(checked) => {
                handleInputChange("newsletter_enabled", checked);
                handleSave("newsletter_enabled", checked);
              }}
              className="transition-all duration-200 hover:scale-110"
            />
          </div>
        </CardContent>
      </Card>

      {/* API Status Check */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center space-y-2 hover:bg-muted/50 transition-colors duration-200">
              <Mail className="h-8 w-8 mx-auto text-primary" />
              <p className="font-medium">Brevo API</p>
              <p className={`text-sm ${localConfig.brevo_api_key ? 'text-green-600' : 'text-red-600'}`}>
                {localConfig.brevo_api_key ? 'Connected' : 'Not Configured'}
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center space-y-2 hover:bg-muted/50 transition-colors duration-200">
              <CreditCard className="h-8 w-8 mx-auto text-primary" />
              <p className="font-medium">Ziina API</p>
              <p className={`text-sm ${localConfig.ziina_api_key ? 'text-green-600' : 'text-red-600'}`}>
                {localConfig.ziina_api_key ? 'Connected' : 'Not Configured'}
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center space-y-2 hover:bg-muted/50 transition-colors duration-200">
              <CreditCard className="h-8 w-8 mx-auto text-primary" />
              <p className="font-medium">PayPal</p>
              <p className={`text-sm ${localConfig.paypal_client_id ? 'text-green-600' : 'text-red-600'}`}>
                {localConfig.paypal_client_id ? 'Connected' : 'Not Configured'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
