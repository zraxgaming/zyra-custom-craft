
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Package, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  user_id: string;
  profiles?: {
    display_name?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Get orders first
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Get profiles for each order
      const ordersWithProfiles = await Promise.all(
        (ordersData || []).map(async (order) => {
          if (order.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name, email, first_name, last_name')
              .eq('id', order.user_id)
              .single();
            
            return { ...order, profiles: profile };
          }
          return order;
        })
      );

      setOrders(ordersWithProfiles);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerName = (order: Order) => {
    if (order.profiles) {
      const { first_name, last_name, display_name, email } = order.profiles;
      return `${first_name || ''} ${last_name || ''}`.trim() || display_name || email || 'Unknown Customer';
    }
    return 'Unknown Customer';
  };

  const filteredOrders = orders.filter(order => {
    const customerName = getCustomerName(order).toLowerCase();
    const orderId = order.id.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return customerName.includes(search) || orderId.includes(search);
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold animate-slide-in-left">Orders Management</h1>
          <div className="flex gap-4 animate-slide-in-right">
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="font-medium">{orders.length} Total Orders</span>
              </div>
            </Card>
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-medium">
                  ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                </span>
              </div>
            </Card>
          </div>
        </div>

        <Card className="animate-slide-in-up">
          <CardHeader>
            <CardTitle>Search Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by customer name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredOrders.map((order, index) => (
            <Card key={order.id} className="animate-slide-in-up hover:shadow-lg transition-all duration-300" style={{animationDelay: `${index * 50}ms`}}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold text-lg">Order #{order.id.slice(-8)}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getStatusColor(order.payment_status)}>
                        Payment: {order.payment_status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Customer: {getCustomerName(order)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    
                    <Button asChild className="hover:scale-105 transition-transform">
                      <Link to={`/admin/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredOrders.length === 0 && (
            <Card className="animate-fade-in">
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "No orders match your search." : "Orders will appear here once customers start purchasing."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
