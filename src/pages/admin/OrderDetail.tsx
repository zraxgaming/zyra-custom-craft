
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, Package, User, CreditCard, Truck } from "lucide-react";
import { format } from "date-fns";
import { OrderDetail as OrderDetailType } from "@/types/order";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    if (id && isAdmin) {
      fetchOrderDetail();
    }
  }, [id, isAdmin]);

  const fetchOrderDetail = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          created_at,
          updated_at,
          status,
          payment_status,
          payment_method,
          total_amount,
          currency,
          delivery_type,
          shipping_address,
          billing_address,
          notes,
          tracking_number,
          user_id,
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

      // Transform the data to match our OrderDetail type
      const transformedOrder: OrderDetailType = {
        ...data,
        profiles: undefined // We'll fetch profile data separately if needed
      };

      setOrder(transformedOrder);
      setTrackingNumber(data.tracking_number || "");
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error loading order",
        description: error.message,
        variant: "destructive",
      });
      navigate("/admin/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id);

      if (error) throw error;

      setOrder({ ...order, status: newStatus as any });
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateTrackingNumber = async () => {
    if (!order) return;

    try {
      const { error } = await supabase
        .from("orders")
        .update({ tracking_number: trackingNumber })
        .eq("id", order.id);

      if (error) throw error;

      setOrder({ ...order, tracking_number: trackingNumber });
      toast({
        title: "Tracking number updated",
        description: "The tracking number has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating tracking number",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-muted-foreground">
            You don't have permission to access this page.
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-muted-foreground">
            Order not found.
          </div>
        </div>
      </AdminLayout>
    );
  }

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

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/orders")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
              <p className="text-muted-foreground">Order #{order.id.substring(0, 8)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            <Badge className={getPaymentStatusColor(order.payment_status)}>
              {order.payment_status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.product?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price}
                        </p>
                        {item.customization && (
                          <p className="text-sm text-muted-foreground">
                            Customization: {JSON.stringify(item.customization)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-foreground">
                    ${order.total_amount?.toFixed(2)} {order.currency}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Truck className="h-5 w-5" />
                  Shipping & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tracking">Tracking Number</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="tracking"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                      />
                      <Button onClick={updateTrackingNumber}>
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Delivery Type</Label>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.delivery_type}
                    </p>
                  </div>

                  {order.shipping_address && (
                    <div>
                      <Label>Shipping Address</Label>
                      <div className="text-sm text-muted-foreground">
                        <p>{(order.shipping_address as any).name}</p>
                        <p>{(order.shipping_address as any).street}</p>
                        <p>
                          {(order.shipping_address as any).city}, {(order.shipping_address as any).state} {(order.shipping_address as any).zipCode}
                        </p>
                        <p>{(order.shipping_address as any).country}</p>
                        {(order.shipping_address as any).phone && (
                          <p>Phone: {(order.shipping_address as any).phone}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label>Customer</Label>
                    <p className="text-sm text-muted-foreground">
                      {order.profiles?.display_name || "Guest"}
                    </p>
                  </div>
                  {order.profiles?.email && (
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-muted-foreground">
                        {order.profiles.email}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label>Order Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), "PPP")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label>Payment Method</Label>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.payment_method}
                    </p>
                  </div>
                  <div>
                    <Label>Payment Status</Label>
                    <Badge className={getPaymentStatusColor(order.payment_status)}>
                      {order.payment_status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <p className="text-sm text-muted-foreground">
                      ${order.total_amount?.toFixed(2)} {order.currency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                    <Button
                      key={status}
                      variant={order.status === status ? "default" : "outline"}
                      className="w-full justify-start capitalize"
                      onClick={() => updateOrderStatus(status)}
                    >
                      {status}
                    </Button>
                  ))}
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
