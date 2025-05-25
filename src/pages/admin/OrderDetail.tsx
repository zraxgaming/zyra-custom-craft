
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Package, CreditCard, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { OrderDetail as OrderDetailType } from "@/types/order";
import CustomerInfo from "@/components/admin/order/CustomerInfo";
import OrderSummary from "@/components/admin/order/OrderSummary";
import PaymentInfo from "@/components/admin/order/PaymentInfo";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              images,
              slug
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Parse JSON addresses and ensure proper typing
      const parsedOrder: OrderDetailType = {
        ...data,
        status: data.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
        payment_status: data.payment_status as "pending" | "paid" | "failed" | "refunded",
        shipping_address: data.shipping_address ? JSON.parse(data.shipping_address as string) : null,
        billing_address: data.billing_address ? JSON.parse(data.billing_address as string) : null,
        profiles: null,
        currency: data.currency || 'USD',
        tracking_number: data.tracking_number || undefined
      };

      setOrder(parsedOrder);
    } catch (error: any) {
      toast({
        title: "Error fetching order",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id);

      if (error) throw error;

      setOrder({ 
        ...order, 
        status: newStatus as "pending" | "processing" | "shipped" | "delivered" | "cancelled"
      });
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
    } finally {
      setIsUpdating(false);
    }
  };

  const updateOrder = async (field: string, value: string) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ [field]: value })
        .eq("id", order.id);

      if (error) throw error;

      setOrder({ ...order, [field]: value } as OrderDetailType);
      toast({
        title: "Order updated",
        description: `${field} updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const sendManualEmail = async () => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase.functions.invoke('send-order-email', {
        body: { orderId: order.id }
      });

      if (error) throw error;

      toast({
        title: "Email sent",
        description: "Order confirmation email sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error sending email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "processing": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "shipped": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Order not found</h1>
            <Button onClick={() => navigate("/admin")} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin")}
              className="text-foreground border-border"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order #{order.id.slice(-8)}</h1>
              <p className="text-muted-foreground">
                Created on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            <Select
              value={order.status}
              onValueChange={updateOrderStatus}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-40 bg-background text-foreground border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <OrderSummary 
                order={order} 
                isUpdating={isUpdating} 
                updateOrder={updateOrder}
                sendManualEmail={sendManualEmail}
              />
            </Card>

            <Card className="bg-card border-border">
              <PaymentInfo 
                order={order} 
                isUpdating={isUpdating} 
                updateOrder={updateOrder}
                sendManualEmail={sendManualEmail}
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CustomerInfo order={order} />
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
