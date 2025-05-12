
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy } from "lucide-react";
import { ShippingAddress, OrderItem } from "@/types/order";

// Import order components
import OrderSummary from "@/components/admin/order/OrderSummary";
import CustomerInfo from "@/components/admin/order/CustomerInfo";
import PaymentInfo from "@/components/admin/order/PaymentInfo";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Fetching order details for ID:", id);
        
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            profiles (
              display_name,
              id
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

        if (error) {
          console.error("Error fetching order:", error);
          throw error;
        }
        
        console.log("Order data retrieved:", data);
        
        // Transform the data to match the types we need
        if (data) {
          const orderItems: OrderItem[] = data.order_items.map((item: any) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            product: {
              name: item.product?.name || "Product no longer available",
              images: item.product?.images || [],
            },
            customization: item.customization as Record<string, any> | null
          }));

          setOrder({
            ...data,
            order_items: orderItems
          });
        }
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
    
    fetchOrder();
  }, [id, toast]);
  
  // Update order status
  const updateOrder = async (field: string, value: string) => {
    if (!id) return;
    
    setIsUpdating(true);
    
    try {
      console.log("Updating order:", { field, value, id });
      
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
              customer_email: order.profiles?.id,
              status: value,
              customer_name: order.profiles?.display_name
            })
          });
          console.log("Email notification sent for status update");
        } catch (error: any) {
          console.error("Error sending update email:", error);
        }
      }
      
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
    if (!id || !order) return;
    
    try {
      console.log("Sending manual email for order:", id);
      
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          order_id: id,
          customer_email: order.profiles?.id,
          status: order.status,
          customer_name: order.profiles?.display_name
        })
      });
      
      toast({
        title: "Email sent",
        description: "Order confirmation email sent successfully",
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
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
            <OrderSummary 
              order={order}
              isUpdating={isUpdating}
              updateOrder={updateOrder}
              sendManualEmail={sendManualEmail}
            />
          </Card>
          
          {/* Customer Info */}
          <div className="space-y-6">
            <Card>
              <CustomerInfo 
                profiles={order.profiles} 
                shippingAddress={shippingAddress} 
              />
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
