
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { TrendingUp, DollarSign, Users, CreditCard } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const ZiinaStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchZiinaStats();
  }, []);

  const fetchZiinaStats = async () => {
    try {
      // Fetch orders with Ziina payment method
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("payment_method", "ziina")
        .eq("payment_status", "paid");

      if (error) throw error;

      // Calculate basic stats
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const totalOrders = orders?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Fetch all orders for conversion rate
      const { data: allOrders, error: allOrdersError } = await supabase
        .from("orders")
        .select("payment_method, payment_status");

      if (allOrdersError) throw allOrdersError;

      const ziinaOrders = allOrders?.filter(order => order.payment_method === "ziina").length || 0;
      const totalAllOrders = allOrders?.length || 0;
      const conversionRate = totalAllOrders > 0 ? (ziinaOrders / totalAllOrders) * 100 : 0;

      setStats({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        conversionRate
      });

      // Generate monthly data for last 6 months
      const monthlyStats = generateMonthlyData(orders || []);
      setMonthlyData(monthlyStats);

      // Generate payment method comparison
      const paymentStats = generatePaymentMethodData(allOrders || []);
      setPaymentMethodData(paymentStats);

    } catch (error: any) {
      console.error("Error fetching Ziina stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMonthlyData = (orders: any[]) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const revenue = monthOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      
      months.push({
        month: `${monthName} ${year}`,
        revenue: revenue,
        orders: monthOrders.length
      });
    }
    
    return months;
  };

  const generatePaymentMethodData = (orders: any[]) => {
    const paymentMethods = ['ziina', 'paypal', 'credit_card'];
    
    return paymentMethods.map(method => {
      const methodOrders = orders.filter(order => 
        order.payment_method === method && order.payment_status === 'paid'
      );
      
      const revenue = methodOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      
      return {
        method: method.charAt(0).toUpperCase() + method.slice(1),
        orders: methodOrders.length,
        revenue: revenue
      };
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Ziina Payment Analytics</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (AED)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From Ziina payments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Paid via Ziina</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageOrderValue.toFixed(2)} AED</div>
              <p className="text-xs text-muted-foreground">Per Ziina transaction</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ziina Usage Rate</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Of all payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Ziina Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} AED`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentMethodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'orders' ? `${value} orders` : `${value} AED`,
                    name === 'orders' ? 'Orders' : 'Revenue'
                  ]} />
                  <Bar dataKey="orders" fill="#8B5CF6" />
                  <Bar dataKey="revenue" fill="#A855F7" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Ziina Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} orders`, 'Orders']} />
                <Bar dataKey="orders" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ZiinaStats;
