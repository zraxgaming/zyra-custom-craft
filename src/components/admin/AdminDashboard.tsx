
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Star,
  Gift,
  Mail,
  BarChart3,
  Calendar,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalViews: number;
  giftCardsSold: number;
  newsletterSubscribers: number;
  averageOrderValue: number;
}

interface RecentOrder {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_email?: string;
  payment_status: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalViews: 0,
    giftCardsSold: 0,
    newsletterSubscribers: 0,
    averageOrderValue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all dashboard data in parallel
      const [
        productsResult,
        ordersResult,
        usersResult,
        viewsResult,
        giftCardsResult,
        newsletterResult,
        recentOrdersResult
      ] = await Promise.all([
        supabase.from('products').select('id').eq('status', 'published'),
        supabase.from('orders').select('total_amount, status, created_at'),
        supabase.from('profiles').select('id'),
        supabase.from('page_views').select('id'),
        supabase.from('gift_cards').select('initial_amount'),
        supabase.from('newsletter_subscriptions').select('id').eq('is_active', true),
        supabase.from('orders')
          .select(`
            id,
            total_amount,
            status,
            payment_status,
            created_at,
            profiles!orders_user_id_fkey (
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      // Calculate stats
      const products = productsResult.data || [];
      const orders = ordersResult.data || [];
      const users = usersResult.data || [];
      const views = viewsResult.data || [];
      const giftCards = giftCardsResult.data || [];
      const subscribers = newsletterResult.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const monthlyOrders = orders.filter(order => new Date(order.created_at) > oneMonthAgo);
      const weeklyOrders = orders.filter(order => new Date(order.created_at) > oneWeekAgo);
      const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);

      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'completed').length;

      const giftCardRevenue = giftCards.reduce((sum, card) => sum + Number(card.initial_amount), 0);

      const newStats: DashboardStats = {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        monthlyRevenue,
        weeklyOrders: weeklyOrders.length,
        pendingOrders,
        completedOrders,
        totalViews: views.length,
        giftCardsSold: giftCards.length,
        newsletterSubscribers: subscribers.length,
        averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
      };

      setStats(newStats);
      setRecentOrders(recentOrdersResult.data || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <Button onClick={fetchDashboardData} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-3d-lift animate-scale-in border-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.monthlyRevenue)} this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover-3d-lift animate-scale-in border-gradient" style={{animationDelay: '100ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.weeklyOrders} this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover-3d-lift animate-scale-in border-gradient" style={{animationDelay: '200ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active products
            </p>
          </CardContent>
        </Card>

        <Card className="hover-3d-lift animate-scale-in border-gradient" style={{animationDelay: '300ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-3d-lift animate-slide-in-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total page views</p>
          </CardContent>
        </Card>

        <Card className="hover-3d-lift animate-slide-in-up" style={{animationDelay: '100ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gift Cards Sold</CardTitle>
            <Gift className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{stats.giftCardsSold}</div>
            <p className="text-xs text-muted-foreground">Total gift cards</p>
          </CardContent>
        </Card>

        <Card className="hover-3d-lift animate-slide-in-up" style={{animationDelay: '200ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.newsletterSubscribers}</div>
            <p className="text-xs text-muted-foreground">Active subscribers</p>
          </CardContent>
        </Card>

        <Card className="hover-3d-lift animate-slide-in-up" style={{animationDelay: '300ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="animate-slide-in-left card-premium">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent orders</p>
                </div>
              ) : (
                recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300 animate-fade-in hover-magnetic"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium">#{order.id.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(Number(order.total_amount))}</p>
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

        {/* Order Status Summary */}
        <Card className="animate-slide-in-right card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Order Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span>Pending Orders</span>
                </div>
                <span className="font-bold text-yellow-600">{stats.pendingOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Completed Orders</span>
                </div>
                <span className="font-bold text-green-600">{stats.completedOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Total Orders</span>
                </div>
                <span className="font-bold text-blue-600">{stats.totalOrders}</span>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-bounce-in card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/products">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2 hover-3d-lift">
                <Package className="h-6 w-6" />
                <span className="text-sm">Manage Products</span>
              </Button>
            </Link>
            
            <Link to="/admin/orders">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2 hover-3d-lift">
                <ShoppingCart className="h-6 w-6" />
                <span className="text-sm">View Orders</span>
              </Button>
            </Link>
            
            <Link to="/admin/users">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2 hover-3d-lift">
                <Users className="h-6 w-6" />
                <span className="text-sm">Manage Users</span>
              </Button>
            </Link>
            
            <Link to="/admin/analytics">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2 hover-3d-lift">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">View Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
