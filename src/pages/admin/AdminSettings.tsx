import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, CreditCard, Mail, AlertTriangle, Globe, Users } from "lucide-react";
import MaintenanceToggle from "@/components/admin/MaintenanceToggle";
import PaymentMethodsSettings from "@/components/admin/settings/PaymentMethodsSettings";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";

const AdminSettings = () => {
  const [isZiinaLive, setIsZiinaLive] = useState(false);
  const [loadingZiina, setLoadingZiina] = useState(false);

  useEffect(() => {
    // Fetch current value from site_config
    const fetchZiinaEnv = async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_env')
        .maybeSingle();
      setIsZiinaLive(data?.value === "prod");
    };
    fetchZiinaEnv();
  }, []);

  const handleZiinaEnvToggle = async () => {
    setLoadingZiina(true);
    await supabase
      .from('site_config')
      .upsert({ key: 'ziina_env', value: isZiinaLive ? "test" : "prod" });
    setIsZiinaLive(!isZiinaLive);
    setLoadingZiina(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-muted/50">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">General site configuration options coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <PaymentMethodsSettings />
          </TabsContent>

          <TabsContent value="email">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Email configuration options coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceToggle />
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>User Management Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management configuration options coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Advanced configuration options coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-4 mb-4">
          <span className="font-medium">Enable Ziina <span className="ml-1">(Mode: {isZiinaLive ? "Live" : "Testing"})</span></span>
          <Switch checked={isZiinaLive} onCheckedChange={handleZiinaEnvToggle} disabled={loadingZiina} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
