
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, Package, Truck, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface OrderDetail {
  id: string;
  created_at: string;
  updated_at: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  delivery_type: string;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    name: string;
    phone?: string;
  } | null;
  user_id: string | null;
  profiles: {
    display_name: string;
    email: string;
  } | null;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      images: string[];
    };
    customization?: any;
  }>;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isOrderLoading, setIsOrderLoading] = useState(true);
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

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            profiles:user_id (display_name, email),
            order_items (
              id,
              quantity,
              price,
              product:product_id (name, images),
              customization
            )
          `)
          .eq("id", id)
          .single();
          
        if (error) throw error;
        setOrder(data);
      } catch (error: any) {
        toast({
          title: "Error fetching order",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsOrderLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, toast]);

  const updateOrderStatus = async (status: string) => {
    if (!order) return;
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", order.id);
        
      if (error) throw error;
      
      setOrder(prev => prev ? { ...prev, status } : null);
      
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

  const updatePaymentStatus = async (payment_status: string) => {
    if (!order) return;
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status })
        .eq("id", order.id);
        
      if (error) throw error;
      
      setOrder(prev => prev ? { ...prev, payment_status } : null);
      
      toast({
        title: "Payment updated",
        description: `Payment status changed to ${payment_status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating payment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading || isOrderLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Button 
            variant="outline" 
            className="mb-6"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          <div className="bg-muted rounded-lg p-12 text-center">
            <h3 className="text-xl font-medium mb-2">Order not found</h3>
            <p className="text-muted-foreground">
              The order you're looking for does not exist or has been removed.
            </p>
            <Button 
              className="mt-4"
              onClick={() => navigate("/admin/orders")}
            >
              View All Orders
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate("/admin/orders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id.substring(0, 8)}</h1>
            <p className="text-gray-500">
              Placed on {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              value={order.status}
              onValueChange={updateOrderStatus}
            >
              <SelectTrigger className="w-40">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 
                  ${order.status === 'pending' ? 'bg-orange-500' : 
                    order.status === 'processing' ? 'bg-blue-500' : 
                    order.status === 'shipped' ? 'bg-yellow-500' : 
                    order.status === 'delivered' ? 'bg-green-500' : 
                    'bg-red-500'}`}></span>
                <SelectValue>{order.status}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="capitalize">{order.payment_method.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                  <Select
                    value={order.payment_status}
                    onValueChange={updatePaymentStatus}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 
                        ${order.payment_status === 'paid' ? 'bg-green-500' : 
                          order.payment_status === 'pending' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                      <SelectValue>{order.payment_status}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold">${order.total_amount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.profiles ? (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p>{order.profiles.display_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{order.profiles.email}</p>
                    </div>
                  </>
                ) : (
                  <div>
                    <Badge variant="outline">Guest Checkout</Badge>
                  </div>
                )}
                {order.shipping_address?.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{order.shipping_address.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shipping_address ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Delivery Type</p>
                    <p className="capitalize">{order.delivery_type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
                    <p>{order.shipping_address.name}</p>
                    <p>{order.shipping_address.street}</p>
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                    </p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No shipping information provided.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded overflow-hidden bg-gray-100 mr-3">
                          <img 
                            src={item.product.images?.[0] || "/placeholder.svg"} 
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          {item.customization && (
                            <div className="text-xs text-gray-500">
                              {Object.entries(item.customization).map(([key, value]) => (
                                <p key={key}>{key}: {String(value)}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
