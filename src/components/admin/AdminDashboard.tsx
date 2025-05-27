
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  ShoppingCart,
  Star,
  BarChart3,
  Eye,
  ArrowRight,
  Activity,
  Calendar,
  AlertTriangle
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch basic stats
      const [ordersData, productsData, usersData, reviewsData] = await Promise.all([
        supabase.from('orders').select('total_amount, status, created_at').eq('payment_status', 'paid'),
        supabase.from('products').select('stock_quantity, rating'),
        supabase.from('profiles').select('id'),
        supabase.from('reviews').select('rating')
      ]);

      const totalRevenue = ordersData.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const totalOrders = ordersData.data?.length || 0;
      const totalProducts = productsData.data?.length || 0;
      const totalUsers = usersData.data?.length || 0;
      const lowStockProducts = productsData.data?.filter(p => p.stock_quantity < 10).length || 0;
      const pendingOrders = ordersData.data?.filter(o => o.status === 'pending').length || 0;
      
      const averageRating = reviewsData.data?.length > 0 
        ? reviewsData.data.reduce((sum, review) => sum + review.rating, 0) / reviewsData.data.length 
        : 0;
      const totalReviews = reviewsData.data?.length || 0;

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        lowStockProducts,
        pendingOrders,
        averageRating,
        totalReviews
      });

      // Fetch recent orders
      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          profiles:profile_id(display_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentOrders(recentOrdersData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: "Add Product", path: "/admin/products/new", icon: Package, color: "bg-blue-500" },
    { title: "View Orders", path: "/admin/orders", icon: ShoppingCart, color: "bg-green-500" },
    { title: "Manage Categories", path: "/admin/categories", icon: BarChart3, color: "bg-purple-500" },
    { title: "Check Inventory", path: "/admin/inventory", icon: AlertTriangle, color: "bg-orange-500" },
    { title: "Generate Barcodes", path: "/admin/barcodes", icon: Eye, color: "bg-indigo-500" },
    { title: "Site Settings", path: "/admin/settings", icon: Activity, color: "bg-pink-500" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold animate-slide-in-left bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <Badge variant="outline" className="animate-bounce-in">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-gradient hover-3d-lift animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-gradient hover-3d-lift animate-scale-in" style={{animationDelay: '100ms'}}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2 text-blue-600" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingOrders} pending</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-gradient hover-3d-lift animate-scale-in" style={{animationDelay: '200ms'}}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Package className="h-4 w-4 mr-2 text-purple-600" />
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">{stats.lowStockProducts} low stock</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-gradient hover-3d-lift animate-scale-in" style={{animationDelay: '300ms'}}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-600" />
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">{stats.totalReviews} reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-gradient animate-slide-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-20 flex-col gap-2 hover-3d-lift animate-slide-in-up hover-magnetic glass-card"
                style={{animationDelay: `${index * 100}ms`}}
                onClick={() => navigate(action.path)}
              >
                <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="glass-card border-gradient animate-slide-in-up" style={{animationDelay: '400ms'}}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">No recent orders</p>
              </div>
            ) : (
              recentOrders.map((order: any, index) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in-up hover-3d-lift"
                  style={{animationDelay: `${500 + index * 100}ms`}}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">#{order.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.profiles?.display_name || order.profiles?.email || 'Guest'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${Number(order.total_amount).toFixed(2)}</p>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
