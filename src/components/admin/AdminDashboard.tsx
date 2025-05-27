
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  Activity,
  Star,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: any[];
  topProducts: any[];
  monthlyRevenue: number[];
}

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      // Fetch total revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at, status, payment_status');

      // Fetch total users
      const { data: users } = await supabase
        .from('profiles')
        .select('id');

      // Fetch total products
      const { data: products } = await supabase
        .from('products')
        .select('id, name, price, images');

      // Fetch recent orders with profile data
      const { data: recentOrders } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          profiles:user_id (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const totalRevenue = orders?.filter(o => o.payment_status === 'paid')
        .reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      const totalOrders = orders?.length || 0;
      const totalUsers = users?.length || 0;
      const totalProducts = products?.length || 0;

      // Calculate monthly revenue for the last 6 months
      const now = new Date();
      const monthlyRevenue = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const monthRevenue = orders?.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate >= monthStart && orderDate <= monthEnd && o.payment_status === 'paid';
        }).reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        
        monthlyRevenue.push(monthRevenue);
      }

      return {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        recentOrders: recentOrders || [],
        topProducts: products?.slice(0, 5) || [],
        monthlyRevenue
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-in-up">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/30 border-green-200 dark:border-green-800/50 animate-scale-in hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400 animate-float" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              ${stats?.totalRevenue.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-950/20 dark:to-sky-950/30 border-blue-200 dark:border-blue-800/50 animate-scale-in hover-lift" style={{animationDelay: '100ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-float" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {stats?.totalOrders || 0}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-950/30 border-purple-200 dark:border-purple-800/50 animate-scale-in hover-lift" style={{animationDelay: '200ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-float" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {stats?.totalUsers || 0}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-amber-950/30 border-orange-200 dark:border-orange-800/50 animate-scale-in hover-lift" style={{animationDelay: '300ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-orange-600 dark:text-orange-400 animate-float" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              {stats?.totalProducts || 0}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +5.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary animate-float" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentOrders.map((order, index) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
                  <div>
                    <p className="font-medium">
                      {order.profiles?.first_name} {order.profiles?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.profiles?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${Number(order.total_amount).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary animate-float" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
                  <img
                    src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">${Number(product.price).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 animate-slide-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary animate-float" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105">
              <Package className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Product</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105">
              <ShoppingCart className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">View Orders</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Manage Users</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105">
              <Activity className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Analytics</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
