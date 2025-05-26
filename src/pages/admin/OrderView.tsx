
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, User, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { OrderDetail } from "@/types/order";
import PaymentInfo from "@/components/admin/order/PaymentInfo";

const OrderView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

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

  useEffect(() => {
    if (id && user) {
      fetchOrder();
    }
  }, [id, user]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email
          ),
          order_items (
            *,
            product:products (
              name,
              images
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setOrder(data);
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
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq("id", order.id);

      if (error) throw error;

      toast({
        title: "Order updated",
        description: `${field} has been updated successfully.`,
      });

      fetchOrder();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return null;
  }

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
            <Button onClick={() => navigate("/admin/orders")} className="mt-4">
              Back to Orders
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
              onClick={() => navigate("/admin/orders")}
              className="text-foreground border-border"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order #{order.id.slice(-8)}</h1>
              <p className="text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.order_items && order.order_items.length > 0 ? (
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          {item.product?.images && item.product.images.length > 0 ? (
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product?.name || 'Unknown Product'}</h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No items found for this order.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Name</h4>
                  <p className="text-muted-foreground">
                    {order.profiles?.first_name} {order.profiles?.last_name}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-foreground">Email</h4>
                  <p className="text-muted-foreground">{order.profiles?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
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

export default OrderView;
