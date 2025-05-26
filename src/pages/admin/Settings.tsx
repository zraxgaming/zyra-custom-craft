
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import PaymentMethodsSettings from "@/components/admin/settings/PaymentMethodsSettings";
import ShippingMethodsSettings from "@/components/admin/settings/ShippingMethodsSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, CreditCard, Truck, Bell, Shield, Globe } from "lucide-react";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 animate-slide-in-right">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="animate-fade-in">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="payments" className="animate-fade-in">
            <PaymentMethodsSettings />
          </TabsContent>

          <TabsContent value="shipping" className="animate-fade-in">
            <ShippingMethodsSettings />
          </TabsContent>

          <TabsContent value="notifications" className="animate-fade-in">
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              <p className="text-muted-foreground">Notification settings will be implemented here.</p>
            </div>
          </TabsContent>

          <TabsContent value="security" className="animate-fade-in">
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <p className="text-muted-foreground">Security settings will be implemented here.</p>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="animate-fade-in">
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Third-party Integrations</h3>
              <p className="text-muted-foreground">Integration settings will be implemented here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
