
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import RealTimeAnalytics from "@/components/admin/RealTimeAnalytics";
import ProductClicksAnalysis from "@/components/admin/ProductClicksAnalysis";
import SalesByCategory from "@/components/admin/SalesByCategory";
import TrafficAnalysis from "@/components/admin/TrafficAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for your business
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <RealTimeAnalytics />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductClicksAnalysis />
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <SalesByCategory />
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <TrafficAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
