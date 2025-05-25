
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OrderSummary from "@/components/admin/order/OrderSummary";
import PaymentInfo from "@/components/admin/order/PaymentInfo";
import CustomerInfo from "@/components/admin/order/CustomerInfo";
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
    }
  }, [isAdmin, authLoading, navigate, toast]);

  useEffect(() => {
    if (id && isAdmin) {
      fetchOrder();
    }
  }, [id, isAdmin]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items!order_items_order_id_fkey (
            id,
            quantity,
            price,
            customization,
            products!order_items_product_id_fkey (
              id,
              name,
              images
            )
          ),
          profiles!orders_user_id_fkey (
            display_name,
            email
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        const transformedOrder: OrderDetailType = {
          ...data,
          status: data.status as OrderDetailType["status"],
          payment_status: data.payment_status as OrderDetailType["payment_status"],
          shipping_address: data.shipping_address 
            ? (typeof data.shipping_address === 'string' 
              ? JSON.parse(data.shipping_address) 
              : data.shipping_address as unknown as ShippingAddress)
            : undefined,
          billing_address: data.billing_address 
            ? (typeof data.billing_address === 'string' 
              ? JSON.parse(data.billing_address) 
              : data.billing_address as unknown as ShippingAddress)
            : undefined,
          order_items: (data.order_items || []).map((item: any) => ({
            id: item.id,
            order_id: data.id,
            product_id: item.products?.id || '',
            quantity: item.quantity,
            price: item.price,
            customization: item.customization,
            product: item.products ? {
              id: item.products.id,
              name: item.products.name,
              images: item.products.images || []
            } : undefined
          })),
          profiles: data.profiles ? {
            display_name: data.profiles.display_name,
            email: data.profiles.email
          } : undefined
        };
        
        setOrder(transformedOrder);
      }
    } catch (error: any) {
      console.error("Error fetching order:", error);
      toast({
        title: "Error fetching order",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        description: `Order ${field} has been updated successfully.`,
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
    try {
      const { error } = await supabase.functions.invoke('send-order-email', {
        body: { orderId: order?.id }
      });

      if (error) throw error;

      toast({
        title: "Email sent",
        description: "Order confirmation email has been sent to the customer.",
      });
    } catch (error: any) {
      toast({
        title: "Error sending email",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Order not found</h1>
            <p className="text-muted-foreground">The order you're looking for doesn't exist.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            Order #{order.id.substring(0, 8)}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <OrderSummary 
                order={order} 
                isUpdating={isUpdating}
                updateOrder={updateOrder}
                sendManualEmail={sendManualEmail}
              />
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CustomerInfo order={order} />
            </Card>
            
            <Card>
              <PaymentInfo 
                order={order}
                isUpdating={isUpdating}
                updateOrder={updateOrder}
              />
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
