
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface OrderDetails {
  id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  shipping_address: any;
  billing_address: any;
  user_id: string;
  payment_method: string;
  tracking_number?: string;
  notes?: string;
  profiles?: {
    id: string;
    email: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
  };
  order_items?: Array<{
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    customization?: any;
    products?: {
      id: string;
      name: string;
      images: string[];
    };
  }>;
}

const AdminOrderDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            display_name,
            first_name,
            last_name
          ),
          order_items (
            id,
            product_id,
            quantity,
            price,
            customization,
            products (
              id,
              name,
              images
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <p className="text-muted-foreground">The requested order could not be found.</p>
        </div>
      </AdminLayout>
    );
  }

  const customer = order.profiles;
  const customerName = customer 
    ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.display_name || customer.email
    : 'Unknown Customer';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Order #{order.id.slice(-8)}</h1>
          <div className="flex gap-2">
            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
              {order.status}
            </Badge>
            <Badge variant={order.payment_status === 'paid' ? 'default' : 'destructive'}>
              {order.payment_status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Name:</strong> {customerName}</p>
              <p><strong>Email:</strong> {customer?.email || 'N/A'}</p>
              <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> {order.payment_method || 'N/A'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Total:</strong> ${order.total_amount.toFixed(2)}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment Status:</strong> {order.payment_status}</p>
              {order.tracking_number && (
                <p><strong>Tracking:</strong> {order.tracking_number}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {item.products?.images && item.products.images.length > 0 ? (
                      <img 
                        src={item.products.images[0]} 
                        alt={item.products.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.products?.name || 'Product'}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                    {item.customization && (
                      <p className="text-xs text-muted-foreground">
                        Customized
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={() => updateOrderStatus('processing')}
                disabled={order.status === 'processing'}
              >
                Mark as Processing
              </Button>
              <Button 
                onClick={() => updateOrderStatus('shipped')}
                disabled={order.status === 'shipped'}
              >
                Mark as Shipped
              </Button>
              <Button 
                onClick={() => updateOrderStatus('completed')}
                disabled={order.status === 'completed'}
              >
                Mark as Completed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;
