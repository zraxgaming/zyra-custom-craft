
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, Package, CreditCard, Truck } from "lucide-react";
import { format } from "date-fns";
import CustomerInfo from "@/components/admin/order/CustomerInfo";
import PaymentInfo from "@/components/admin/order/PaymentInfo";
import { OrderDetail as OrderDetailType, ShippingAddress } from "@/types/order";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      return;
    }

    if (id && isAdmin) {
      fetchOrderDetail();
    }
  }, [id, isAdmin, authLoading, navigate, toast]);

  const fetchOrderDetail = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
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

      if (error) {
        console.error("Order fetch error:", error);
        throw error;
      }

      const orderWithTypes: OrderDetailType = {
        ...data,
        status: data.status as OrderDetailType['status'],
        payment_status: data.payment_status as OrderDetailType['payment_status'],
        shipping_address: typeof data.shipping_address === 'string' 
          ? JSON.parse(data.shipping_address) as ShippingAddress
          : data.shipping_address as ShippingAddress,
        billing_address: typeof data.billing_address === 'string' 
          ? JSON.parse(data.billing_address) as ShippingAddress
          : data.billing_address as ShippingAddress,
        profiles: undefined,
        currency: data.currency || "AED",
        tracking_number: data.tracking_number || undefined
      };

      setOrder(orderWithTypes);
    } catch (error: any) {
      console.error("Error fetching order:", error);
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

  const updateOrder = async (field: string, value: string) => {
    if (!order) return;

    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("orders")
        .update({ [field]: value })
        .eq("id", order.id);

      if (error) throw error;

      setOrder({
        ...order,
        [field]: value,
        tracking_number: field === 'tracking_number' ? value : order.tracking_number
      });

      toast({
        title: "Order updated",
        description: `${field.replace('_', ' ')} has been updated.`,
      });
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
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

  const orderTotal = order.order_items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/orders")}
            className="text-foreground hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order #{order.id.substring(0, 8)}</h1>
            <p className="text-muted-foreground">
              Placed on {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                      <div className="flex items-center gap-4">
                        {item.product?.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-foreground">{item.product?.name || "Unknown Product"}</h4>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          {item.customization && (
                            <p className="text-xs text-muted-foreground">Customized</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">${item.price.toFixed(2)} each</p>
                        <p className="text-sm text-muted-foreground">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Order Total</span>
                    <span className="text-lg font-bold text-foreground">
                      ${order.total_amount.toFixed(2)} {order.currency}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Truck className="h-5 w-5" />
                  Shipping & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="delivery-type" className="text-foreground">Delivery Type</Label>
                  <p className="mt-1 text-foreground capitalize">{order.delivery_type}</p>
                </div>
                
                <div>
                  <Label htmlFor="tracking-number" className="text-foreground">Tracking Number</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="tracking-number"
                      value={order.tracking_number || ""}
                      onChange={(e) => updateOrder("tracking_number", e.target.value)}
                      placeholder="Enter tracking number"
                      disabled={isUpdating}
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                </div>
                
                {order.notes && (
                  <div>
                    <Label className="text-foreground">Order Notes</Label>
                    <p className="mt-1 text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CustomerInfo 
                profiles={order.profiles} 
                shippingAddress={order.shipping_address}
              />
            </Card>

            <Card className="bg-card border-border">
              <PaymentInfo 
                order={order}
                isUpdating={isUpdating}
                updateOrder={updateOrder}
              />
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground">Current Status</Label>
                    <div className="mt-1">
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
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrder("status", "processing")}
                      disabled={isUpdating}
                      className="text-foreground border-border hover:bg-muted"
                    >
                      Mark Processing
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrder("status", "shipped")}
                      disabled={isUpdating}
                      className="text-foreground border-border hover:bg-muted"
                    >
                      Mark Shipped
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrder("status", "delivered")}
                      disabled={isUpdating}
                      className="text-foreground border-border hover:bg-muted"
                    >
                      Mark Delivered
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateOrder("status", "cancelled")}
                      disabled={isUpdating}
                      className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Cancel Order
                    </Button>
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
