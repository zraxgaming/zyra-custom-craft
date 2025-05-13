
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShippingMethodsSettings from "@/components/admin/settings/ShippingMethodsSettings";
import PaymentMethodsSettings from "@/components/admin/settings/PaymentMethodsSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Methods</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="email">Email Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Store configuration and settings will appear here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <ShippingMethodsSettings />
          </TabsContent>
          
          <TabsContent value="payment" className="mt-6">
            <PaymentMethodsSettings />
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Store appearance settings will appear here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Email Template Settings</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Email template settings will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
