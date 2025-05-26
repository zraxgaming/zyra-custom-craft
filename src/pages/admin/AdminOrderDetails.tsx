
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, DollarSign, User, MapPin, Edit, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import OrderSummary from "@/components/admin/order/OrderSummary";
import PaymentInfo from "@/components/admin/order/PaymentInfo";
import { OrderDetail } from "@/types/order";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) throw orderError;

      // Fetch order items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          price,
          customization,
          product_id,
          products!inner (
            id,
            name,
            images
          )
        `)
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      // Fetch profile information
      let profileData = null;
      if (orderData.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, email, first_name, last_name')
          .eq('id', orderData.user_id)
          .single();
        profileData = profile;
      }

      const transformedItems = (itemsData || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization,
        product: {
          id: item.products.id,
          name: item.products.name,
          images: Array.isArray(item.products.images) 
            ? item.products.images.filter(img => typeof img === 'string') 
            : []
        }
      }));

      setOrder({
        ...orderData,
        order_items: transformedItems,
        profiles: profileData
      });
    } catch (error) {
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

  const updateOrder = async (field: string, value: string) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ [field]: value })
        .eq('id', order.id);

      if (error) throw error;

      setOrder({ ...order, [field]: value });
      toast({
        title: "Success",
        description: "Order updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
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
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Button onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 animate-slide-in-left">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/orders')}
            className="hover:scale-105 transition-transform"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">
              Order #{order.id.slice(-8)} • {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <OrderSummary order={order} />
          </div>

          {/* Right Column - Customer & Payment Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Name</h4>
                    <p className="text-muted-foreground">
                      {order.profiles 
                        ? `${order.profiles.first_name || ''} ${order.profiles.last_name || ''}`.trim() 
                          || order.profiles.display_name 
                          || order.profiles.email
                        : 'Unknown Customer'
                      }
                    </p>
                  </div>
                  
                  {order.profiles?.email && (
                    <div>
                      <h4 className="text-sm font-medium">Email</h4>
                      <p className="text-muted-foreground">{order.profiles.email}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium">User ID</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {order.user_id || 'Guest'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="animate-slide-in-right" style={{animationDelay: '200ms'}}>
              <PaymentInfo 
                order={order}
                isUpdating={isUpdating}
                updateOrder={updateOrder}
              />
            </Card>

            {/* Shipping Address */}
            {order.shipping_address && (
              <Card className="animate-slide-in-right" style={{animationDelay: '400ms'}}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {typeof order.shipping_address === 'object' ? (
                      <div className="space-y-1">
                        <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                        <p>{order.shipping_address.address}</p>
                        <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                        <p>{order.shipping_address.country}</p>
                        {order.shipping_address.phone && <p>Phone: {order.shipping_address.phone}</p>}
                      </div>
                    ) : (
                      <p>{order.shipping_address}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;
