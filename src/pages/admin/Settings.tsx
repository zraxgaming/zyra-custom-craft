
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import ShippingMethodsSettings from "@/components/admin/settings/ShippingMethodsSettings";
import PaymentMethodsSettings from "@/components/admin/settings/PaymentMethodsSettings";
import { Settings as SettingsIcon, Truck, CreditCard, Palette, Mail } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your store configuration, APIs, and preferences
          </p>
        </div>
        
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-5 animate-slide-in-right">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <ShippingMethodsSettings />
          </TabsContent>
          
          <TabsContent value="payment" className="mt-6">
            <PaymentMethodsSettings />
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-6">
            <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
              <p className="text-card-foreground">
                Theme and appearance customization options will be available here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="mt-6">
            <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Email Template Settings</h2>
              <p className="text-card-foreground">
                Email template customization and management options will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
