
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, ShoppingCart, DollarSign, Eye, Package } from "lucide-react";

const RealTimeStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    todayViews: 0,
    lowStockProducts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRealTimeStats();
    
    // Set up real-time subscriptions
    const channels = [
      supabase.channel('orders-changes').on('postgres_changes', { 
        event: '*', schema: 'public', table: 'orders' 
      }, () => fetchRealTimeStats()).subscribe(),
      
      supabase.channel('products-changes').on('postgres_changes', { 
        event: '*', schema: 'public', table: 'products' 
      }, () => fetchRealTimeStats()).subscribe(),
      
      supabase.channel('profiles-changes').on('postgres_changes', { 
        event: '*', schema: 'public', table: 'profiles' 
      }, () => fetchRealTimeStats()).subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const fetchRealTimeStats = async () => {
    try {
      setIsLoading(true);

      // Fetch products count and low stock
      const { data: products } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('status', 'published');

      const totalProducts = products?.length || 0;
      const lowStockProducts = products?.filter(p => (p.stock_quantity || 0) < 10).length || 0;

      // Fetch orders count and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, status');

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

      // Fetch customers count
      const { data: customers } = await supabase
        .from('profiles')
        .select('id');

      const totalCustomers = customers?.length || 0;

      // Fetch today's page views
      const today = new Date().toISOString().split('T')[0];
      const { data: pageViews } = await supabase
        .from('page_views')
        .select('id')
        .gte('timestamp', today);

      const todayViews = pageViews?.length || 0;

      setStats({
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers,
        todayViews,
        lowStockProducts
      });
    } catch (error: any) {
      console.error("Error fetching real-time stats:", error);
      toast({
        title: "Error fetching statistics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%"
    },
    {
      title: "Total Orders", 
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8%"
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-600", 
      bgColor: "bg-purple-100",
      change: "+15%"
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100", 
      change: "+5%"
    },
    {
      title: "Today's Views",
      value: stats.todayViews,
      icon: Eye,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      change: "+22%"
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-100",
      change: "-3%"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {statsCards.map((stat, index) => (
        <Card 
          key={stat.title}
          className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-scale-in bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-border/50"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.color} hover:rotate-12 transition-transform duration-300`}>
                <stat.icon className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RealTimeStats;
