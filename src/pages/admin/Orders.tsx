
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Eye, Package, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!user) {
      navigate("/auth");
      toast({
        title: "Access denied",
        description: "You need to be logged in to access this page.",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles (
            id,
            email,
            display_name,
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false });
          
      if (error) throw error;
      
      const typedOrders: Order[] = (data || []).map(order => ({
        ...order,
        payment_status: order.payment_status as 'pending' | 'paid' | 'failed' | 'refunded',
        status: order.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      }));
      
      setOrders(typedOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error fetching orders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.profiles?.email?.toLowerCase().includes(searchLower) ||
      order.profiles?.display_name?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "refunded": return "bg-purple-100 text-purple-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Orders</h1>
          </div>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID, customer email, or name..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-muted rounded-lg p-12 text-center animate-scale-in">
            <h3 className="text-xl font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms." : "No orders have been placed yet."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden animate-slide-in-right">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      #{order.id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {order.profiles?.display_name || 
                             `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim() || 
                             'Unknown Customer'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.profiles?.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.total_amount}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        {order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:scale-110 transition-transform"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
