
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, User, CreditCard, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { OrderDetail } from "@/types/order";

const OrderView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            id,
            email,
            display_name,
            first_name,
            last_name
          ),
          order_items (
            *,
            product:products (
              id,
              name,
              images
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      const orderDetail: OrderDetail = {
        ...data,
        payment_status: data.payment_status as any,
        status: data.status as any,
        order_items: data.order_items.map((item: any) => ({
          ...item,
          customization: item.customization,
          product: item.product ? {
            id: item.product.id,
            name: item.product.name,
            images: Array.isArray(item.product.images) ? item.product.images : []
          } : undefined
        }))
      };

      setOrder(orderDetail);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500";
      case "shipped": return "bg-blue-500";
      case "processing": return "bg-yellow-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          {item.product?.images?.[0] ? (
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {item.product?.name || 'Unknown Product'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          {item.customization && (
                            <p className="text-sm text-muted-foreground">
                              Customized
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">${item.price}</p>
                        <p className="text-sm text-muted-foreground">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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
                    {order.profiles?.display_name || 
                     `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim() || 
                     'N/A'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-foreground">Email</h4>
                  <p className="text-muted-foreground">{order.profiles?.email || 'N/A'}</p>
                </div>
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
                  <h4 className="text-sm font-medium text-foreground">Total Amount</h4>
                  <p className="text-2xl font-bold text-foreground">${order.total_amount}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-foreground">Payment Status</h4>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                    {order.payment_status}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-foreground">Payment Method</h4>
                  <p className="text-muted-foreground">{order.payment_method || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {order.delivery_type && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Delivery Type</h4>
                    <p className="text-muted-foreground">{order.delivery_type}</p>
                  </div>
                  
                  {order.tracking_number && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Tracking Number</h4>
                      <p className="text-muted-foreground">{order.tracking_number}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderView;
