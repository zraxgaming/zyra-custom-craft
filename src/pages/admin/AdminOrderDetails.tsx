
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, User, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { OrderDetail, OrderItem } from "@/types/order";
import OrderSummary from "@/components/admin/order/OrderSummary";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            id,
            email,
            display_name,
            first_name,
            last_name,
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (orderError) throw orderError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products (
            id,
            name,
            images,
            slug
          )
        `)
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      // Transform the order data to match OrderDetail type
      const transformedOrder: OrderDetail = {
        ...orderData,
        profiles: orderData.profiles ? {
          id: orderData.profiles.id,
          email: orderData.profiles.email,
          display_name: orderData.profiles.display_name,
          first_name: orderData.profiles.first_name,
          last_name: orderData.profiles.last_name,
          full_name: orderData.profiles.full_name,
        } : undefined
      };

      // Transform the items data to match OrderItem type
      const transformedItems: OrderItem[] = (itemsData || []).map(item => ({
        ...item,
        product: {
          ...item.product,
          images: Array.isArray(item.product.images) ? 
            (item.product.images as any[]).filter(img => typeof img === 'string') : 
            []
        }
      }));

      setOrder(transformedOrder);
      setOrderItems(transformedItems);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Order not found</h3>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/admin/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // Add order_items to the order object for OrderSummary
  const orderWithItems = {
    ...order,
    order_items: orderItems
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Order #{order.id.slice(-8)}</h1>
            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
              {order.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <OrderSummary order={orderWithItems} />
          </div>

          <div className="space-y-6">
            {order.profiles && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-medium">Name:</span>
                    <span className="ml-2">
                      {order.profiles.full_name || order.profiles.display_name || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{order.profiles.email || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-medium">Payment Method:</span>
                  <span className="ml-2 capitalize">{order.payment_method || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium">Payment Status:</span>
                  <span className="ml-2">
                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                      {order.payment_status}
                    </Badge>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;
