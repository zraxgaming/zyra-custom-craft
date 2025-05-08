
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ArrowLeft, Copy, ExternalLink, ChevronDown, Mail } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShippingAddress, OrderItem } from "@/types/order";

interface OrderDetailProps {}

const OrderDetail: React.FC<OrderDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            profiles:user_id (
              display_name,
              email:id
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
        
        // Transform the data to match the types we need
        const orderItems: OrderItem[] = data.order_items.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: {
            name: item.product.name,
            images: item.product.images,
          },
          customization: item.customization as Record<string, any> | null
        }));

        setOrder({
          ...data,
          order_items: orderItems
        });
      } catch (error: any) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchOrder();
    }
  }, [id, toast]);
  
  // Update order status
  const updateOrder = async (field: string, value: string) => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({ [field]: value })
        .eq("id", id);
        
      if (error) throw error;
      
      setOrder({
        ...order,
        [field]: value
      });
      
      toast({
        title: "Order updated",
        description: `Order ${field.replace('_', ' ')} updated to ${value}`,
      });
      
      // Send status update email
      if (field === "status") {
        try {
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
              order_id: id,
              customer_email: order.profiles?.email,
              status: value,
              customer_name: order.profiles?.display_name
            })
          });
        } catch (error: any) {
          console.error("Error sending update email:", error);
        }
      }
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Copy order ID to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Order ID copied to clipboard",
    });
  };
  
  // Send manual email
  const sendManualEmail = async () => {
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          order_id: id,
          customer_email: order.profiles?.email,
          status: order.status,
          customer_name: order.profiles?.display_name
        })
      });
      
      toast({
        title: "Email sent",
        description: "Order confirmation email sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
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
  
  // Calculate order total
  const orderTotal = order.order_items.reduce((acc: number, item: any) => {
    return acc + (item.price * item.quantity);
  }, 0);
  
  const shippingAddress = order.shipping_address as ShippingAddress;
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/admin/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Order Details
          </h1>
          <div className="flex items-center gap-2">
            <div className="text-gray-500 text-sm">
              #{order.id.substring(0, 8)}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-1" 
                onClick={() => copyToClipboard(order.id)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <Badge className={
              order.status === "delivered" ? "bg-green-500" :
              order.status === "shipped" ? "bg-blue-500" :
              order.status === "processing" ? "bg-yellow-500" :
              order.status === "cancelled" ? "bg-red-500" :
              "bg-gray-500"
            }>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Placed on {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center" disabled={isUpdating}>
                      Update Status
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateOrder("status", "pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrder("status", "processing")}>
                      Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrder("status", "shipped")}>
                      Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrder("status", "delivered")}>
                      Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrder("status", "cancelled")}>
                      Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="ghost" onClick={sendManualEmail} disabled={isUpdating}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
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
                  {order.order_items.map((item: OrderItem) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            {item.customization && (
                              <p className="text-xs text-gray-500">Customized</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                    <TableCell className="font-medium">${orderTotal.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">Shipping ({order.delivery_type})</TableCell>
                    <TableCell className="font-medium">
                      ${order.delivery_type === "express" ? "15.00" : "5.00"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                    <TableCell className="font-bold">${order.total_amount.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Customer Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {order.profiles?.display_name || "Guest Customer"}
                </p>
                <p className="text-gray-500">
                  {order.profiles?.email || "No email provided"}
                </p>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  {shippingAddress ? (
                    <div className="text-sm">
                      <p>{shippingAddress.name}</p>
                      <p>{shippingAddress.street}</p>
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                      <p>{shippingAddress.country}</p>
                      {shippingAddress.phone && <p>Phone: {shippingAddress.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No shipping address provided</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Payment Method</h4>
                    <p>{order.payment_method === "credit_card" ? "Credit Card" : "PayPal"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Payment Status</h4>
                    <div className="flex items-center mt-1">
                      <Badge className={
                        order.payment_status === "paid" ? "bg-green-500" :
                        order.payment_status === "refunded" ? "bg-orange-500" :
                        "bg-yellow-500"
                      }>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 ml-2" disabled={isUpdating}>
                            Change
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateOrder("payment_status", "pending")}>
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrder("payment_status", "paid")}>
                            Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrder("payment_status", "refunded")}>
                            Refunded
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
