
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const [
        { count: totalProducts },
        { count: totalOrders },
        { count: totalUsers },
        { data: orders },
        { data: products }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount, status').eq('payment_status', 'paid'),
        supabase.from('products').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;

      setStats({
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalUsers: totalUsers || 0,
        totalRevenue,
        pendingOrders,
        lowStockProducts: 0 // You can implement inventory tracking
      });

      // Fetch recent orders
      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            display_name,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentOrders(recentOrdersData || []);
      setTopProducts(products || []);
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
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 animate-slide-in-right" style={{animationDelay: '0ms'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{stats.totalProducts}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Active products</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800 animate-slide-in-right" style={{animationDelay: '100ms'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">{stats.totalOrders}</div>
              <p className="text-xs text-green-600 dark:text-green-400">All time orders</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 animate-slide-in-right" style={{animationDelay: '200ms'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{stats.totalUsers}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50 border-yellow-200 dark:border-yellow-800 animate-slide-in-right" style={{animationDelay: '300ms'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Total earnings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="animate-scale-in" style={{animationDelay: '400ms'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order: any, index) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors animate-fade-in"
                      style={{animationDelay: `${500 + index * 50}ms`}}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">#{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.profiles?.display_name || order.profiles?.first_name || 'Guest'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total_amount}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => window.location.href = '/admin/orders'}>
                <Eye className="mr-2 h-4 w-4" />
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="animate-scale-in" style={{animationDelay: '500ms'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Recent Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product: any, index) => (
                    <div 
                      key={product.id} 
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors animate-fade-in"
                      style={{animationDelay: `${600 + index * 50}ms`}}
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{product.name}</p>
                        <p className="text-sm text-muted-foreground">${product.price}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {product.category || 'General'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No products yet</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => window.location.href = '/admin/products'}>
                <Eye className="mr-2 h-4 w-4" />
                View All Products
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in" style={{animationDelay: '700ms'}}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => window.location.href = '/admin/products/new'} 
                className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Package className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/orders'} 
                variant="outline" 
                className="h-12 border-2 hover:bg-muted/50 transform hover:scale-105 transition-all duration-300"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Manage Orders
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/categories'} 
                variant="outline" 
                className="h-12 border-2 hover:bg-muted/50 transform hover:scale-105 transition-all duration-300"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
