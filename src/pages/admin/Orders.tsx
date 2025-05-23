
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Eye, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  currency: string;
  payment_status: string;
  delivery_type: string;
  profiles?: {
    display_name?: string;
    email?: string;
  };
  order_items?: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
}

const Orders = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, isLoading, navigate, toast]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let query = supabase
          .from("orders")
          .select(`
            *,
            profiles (display_name, email),
            order_items (
              id,
              quantity,
              price,
              product:product_id (name)
            )
          `)
          .order("created_at", { ascending: false });
          
        if (statusFilter && statusFilter !== "all") {
          query = query.eq("status", statusFilter);
        }

        if (paymentStatusFilter && paymentStatusFilter !== "all") {
          query = query.eq("payment_status", paymentStatusFilter);
        }
        
        const { data, error } = await query;
          
        if (error) throw error;
        setOrders(data || []);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error fetching orders",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsOrdersLoading(false);
      }
    };
    
    fetchOrders();
  }, [toast, statusFilter, paymentStatusFilter]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
        
      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status } : order
      ));
      
      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Date', 'Customer', 'Email', 'Items', 'Total', 'Status', 'Payment Status'].join(','),
      ...filteredOrders.map(order => [
        order.id.substring(0, 8),
        format(new Date(order.created_at), "yyyy-MM-dd"),
        order.profiles?.display_name || "Guest",
        order.profiles?.email || "",
        order.order_items?.length || 0,
        `${order.total_amount} ${order.currency}`,
        order.status,
        order.payment_status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Orders exported to CSV file",
    });
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    
    return (
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.profiles?.display_name && 
       order.profiles.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.profiles?.email && 
       order.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-purple-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "paid": return "bg-green-500";
      case "failed": return "bg-red-500";
      case "refunded": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportOrders}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <div className="text-sm text-muted-foreground">
              {orders.length} total orders
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setPaymentStatusFilter("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Orders List</CardTitle>
          </CardHeader>
          <CardContent>
            {isOrdersLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  {searchTerm || statusFilter || paymentStatusFilter ? 
                    "No orders found matching your criteria." : 
                    "No orders have been placed yet."
                  }
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow 
                        key={order.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        <TableCell className="font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.profiles?.display_name || "Guest"}
                            </div>
                            {order.profiles?.email && (
                              <div className="text-sm text-muted-foreground">
                                {order.profiles.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.order_items?.length || 0} items
                        </TableCell>
                        <TableCell className="font-medium">
                          ${order.total_amount?.toFixed(2)} {order.currency}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <div className="flex items-center gap-2">
                                <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></span>
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(order.payment_status)}>
                            {order.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Orders;
