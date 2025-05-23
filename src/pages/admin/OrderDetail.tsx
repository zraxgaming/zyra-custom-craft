
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Mail, Package, CreditCard, MapPin, Save } from "lucide-react";
import { format } from "date-fns";

interface OrderDetail {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  delivery_type: string;
  shipping_address: any;
  billing_address: any;
  tracking_number?: string;
  notes?: string;
  profiles?: {
    display_name?: string;
    email?: string;
  };
  order_items: {
    id: string;
    quantity: number;
    price: number;
    customization?: any;
    product: {
      name: string;
      images?: string[];
    };
  }[];
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  
  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            profiles (
              display_name,
              email
            ),
            order_items (
              id, 
              quantity, 
              price,
              customization,
              product:product_id (
                name,
                images
              )
            )
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        
        setOrder(data);
        setNotes(data.notes || "");
        setTrackingNumber(data.tracking_number || "");
      } catch (error: any) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        navigate("/admin/orders");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, toast, navigate]);
  
  // Update order field
  const updateOrderField = async (field: string, value: string) => {
    if (!id) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ [field]: value })
        .eq("id", id);
        
      if (error) throw error;
      
      if (order) {
        setOrder({
          ...order,
          [field]: value
        });
      }
      
      toast({
        title: "Order updated",
        description: `${field.replace('_', ' ')} updated successfully`,
      });
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const saveNotes = async () => {
    await updateOrderField("notes", notes);
  };

  const saveTrackingNumber = async () => {
    await updateOrderField("tracking_number", trackingNumber);
  };
  
  // Copy order ID to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Order ID copied to clipboard",
    });
  };

  // Send email to customer
  const sendEmailToCustomer = () => {
    if (!order?.profiles?.email) return;
    
    const subject = `Order Update - #${order.id.substring(0, 8)}`;
    const body = `Hello ${order.profiles.display_name || 'Customer'},\n\nYour order #${order.id.substring(0, 8)} has been updated.\n\nOrder Status: ${order.status}\nPayment Status: ${order.payment_status}\n\nThank you for your business!`;
    
    const mailtoLink = `mailto:${order.profiles.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

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
      <AdminLayout>
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!order) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate("/admin/orders")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6 text-center">
              <p>Order not found</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/admin/orders")}
              >
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const subtotal = order.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = order.delivery_type === "express" ? 15 : 5;
  
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Order ID</div>
              <div className="flex items-center gap-2 font-mono">
                #{order.id.substring(0, 8)}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => copyToClipboard(order.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
              <Badge className={getPaymentStatusColor(order.payment_status)}>
                {order.payment_status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Placed on {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.order_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                              {item.product.images && item.product.images.length > 0 ? (
                                <img 
                                  src={item.product.images[0]} 
                                  alt={item.product.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                  No img
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              {item.customization && (
                                <p className="text-xs text-zyra-purple">Customized</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({order.delivery_type})</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)} {order.currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Management */}
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Order Status</Label>
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => updateOrderField("status", value)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                  <div>
                    <Label>Payment Status</Label>
                    <Select 
                      value={order.payment_status} 
                      onValueChange={(value) => updateOrderField("payment_status", value)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                    <Button onClick={saveTrackingNumber} disabled={isUpdating}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Internal Notes</Label>
                  <div className="space-y-2">
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes about this order..."
                      rows={3}
                    />
                    <Button onClick={saveNotes} disabled={isUpdating}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Customer & Payment Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium">
                    {order.profiles?.display_name || "Guest Customer"}
                  </div>
                  {order.profiles?.email && (
                    <div className="text-sm text-muted-foreground">
                      {order.profiles.email}
                    </div>
                  )}
                </div>
                
                {order.shipping_address && (
                  <div>
                    <div className="text-sm font-medium mb-1">Shipping Address</div>
                    <div className="text-sm text-muted-foreground">
                      <div>{order.shipping_address.name}</div>
                      <div>{order.shipping_address.street}</div>
                      <div>
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                      </div>
                      <div>{order.shipping_address.country}</div>
                      {order.shipping_address.phone && (
                        <div>Phone: {order.shipping_address.phone}</div>
                      )}
                    </div>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  onClick={sendEmailToCustomer}
                  disabled={!order.profiles?.email}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Customer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Payment Method</div>
                  <div className="text-sm text-muted-foreground">
                    {order.payment_method || "Not specified"}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Delivery Type</div>
                  <div className="text-sm text-muted-foreground">
                    {order.delivery_type === "express" ? "Express Delivery" : "Standard Delivery"}
                  </div>
                </div>

                {order.tracking_number && (
                  <div>
                    <div className="text-sm font-medium">Tracking Number</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {order.tracking_number}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
