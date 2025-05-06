
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { ShoppingBag, Users, CreditCard, TrendingUp, MousePointer, Eye } from "lucide-react";
import RecentOrders from "@/components/admin/RecentOrders";
import SalesByCategory from "@/components/admin/SalesByCategory";
import TrafficAnalysis from "@/components/admin/TrafficAnalysis";
import ProductClicksAnalysis from "@/components/admin/ProductClicksAnalysis";

const Dashboard = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard 
            title="Total Sales" 
            value="$12,345" 
            change="+12%" 
            icon={<CreditCard className="h-8 w-8" />} 
          />
          <StatsCard 
            title="Orders" 
            value="152" 
            change="+8%" 
            icon={<ShoppingBag className="h-8 w-8" />} 
          />
          <StatsCard 
            title="Customers" 
            value="2,540" 
            change="+24%" 
            icon={<Users className="h-8 w-8" />} 
          />
          <StatsCard 
            title="Revenue" 
            value="$9,876" 
            change="+6%" 
            icon={<TrendingUp className="h-8 w-8" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOrders />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales by product category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <SalesByCategory />
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <TrafficAnalysis />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <ProductClicksAnalysis />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsCard 
            title="Page Views" 
            value="12,567" 
            change="+18%" 
            icon={<Eye className="h-8 w-8" />} 
          />
          <StatsCard 
            title="Product Clicks" 
            value="3,890" 
            change="+12%" 
            icon={<MousePointer className="h-8 w-8" />} 
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
