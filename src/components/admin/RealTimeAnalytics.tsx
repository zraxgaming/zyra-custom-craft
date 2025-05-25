
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Users, ShoppingCart, TrendingUp } from "lucide-react";

const RealTimeAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    orders: 0,
    revenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch analytics data
      const { data: analytics, error: analyticsError } = await supabase
        .from('analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);

      if (analyticsError) throw analyticsError;

      // Fetch orders count and revenue
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (ordersError) throw ordersError;

      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const totalOrders = orders?.length || 0;

      setAnalyticsData(analytics || []);
      setStats({
        pageViews: analytics?.reduce((sum, day) => sum + day.views, 0) || 0,
        uniqueVisitors: analytics?.reduce((sum, day) => sum + day.unique_visitors, 0) || 0,
        orders: totalOrders,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = analyticsData.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    views: item.views,
    visitors: item.unique_visitors
  }));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders (24h)</p>
                <p className="text-2xl font-bold">{stats.orders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue (24h)</p>
                <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle>Traffic Trends (Last 7 Days)</CardTitle>
          <CardDescription>Page views and unique visitors over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="visitors" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAnalytics;
