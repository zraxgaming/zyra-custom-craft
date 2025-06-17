import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Package, Eye, Loader2 } from "lucide-react";
import { Order, OrderItem } from "@/types/order";
import { format } from "date-fns";

const Orders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setOrders([]);
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            customization,
            products:product_id (
              id,
              name,
              images
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our types
      const transformedOrders: Order[] = (data || []).map(order => ({
        ...order,
        order_items: order.order_items?.map((item: any) => ({
          ...item,
          product: {
            id: item.products?.id || '',
            name: item.products?.name || 'Unknown Product',
            images: Array.isArray(item.products?.images) 
              ? item.products.images 
              : item.products?.images 
                ? [item.products.images] 
                : [],
            slug: item.products?.slug || ''
          }
        })) || []
      }));

      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 animate-fade-in">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-bounce" />
          <h3 className="text-lg font-semibold mb-2">Sign in to view your orders</h3>
          <p className="text-muted-foreground mb-6">
            Please sign in to your account to view your order history.
          </p>
          <Button onClick={() => window.location.href = '/auth'} className="animate-pulse">
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-bounce" />
          <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <Button onClick={() => window.location.href = '/shop'} className="animate-pulse">
            Start Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6 text-primary animate-pulse" />
        <h2 className="text-2xl font-bold">My Orders</h2>
      </div>
      
      {orders.map((order, index) => (
        <Card key={order.id} className="hover:shadow-lg transition-all duration-300 animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed on {format(new Date(order.created_at), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="text-right">
                <Badge className={`${getStatusColor(order.status)} text-white animate-pulse`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <p className="text-lg font-bold mt-2 text-primary">
                  ${order.total_amount.toFixed(2)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_items?.map((item: OrderItem) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg animate-scale-in">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                    {item.customization && Object.keys(item.customization).length > 0 && (
                      <div className="mt-2 p-2 bg-primary/10 rounded text-xs">
                        <strong>Customization:</strong>
                        <ul className="mt-1">
                          {Object.entries(item.customization).map(([key, value]) => (
                            <li key={key}>
                              {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Payment: {order.payment_method || 'Unknown'}
              </div>
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
