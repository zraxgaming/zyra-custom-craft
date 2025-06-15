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
import { RefreshCw } from "lucide-react";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refunds, setRefunds] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  useEffect(() => {
    if (order) fetchRefunds();
  }, [order]);

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
          order_id,
          product_id,
          quantity,
          price,
          customization,
          product:products!order_items_product_id_fkey (
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
        order_id: item.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization,
        product: {
          id: item.product?.id || '',
          name: item.product?.name || 'Unknown Product',
          images: Array.isArray(item.product?.images) 
            ? item.product.images.filter(img => typeof img === 'string') 
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

  const fetchRefunds = async () => {
    if (!order) return;
    const { data, error } = await supabase.from("order_refunds").select("*").eq("order_id", order.id).order("created_at", { ascending: false });
    if (!error && data) setRefunds(data);
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

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order?.payment_intent_id) return;
    setRefundSubmitting(true);
    try {
      // Insert refund request to DB
      const { error } = await supabase
        .from('order_refunds')
        .insert({
          order_id: order.id,
          amount: parseFloat(refundAmount),
          reason: refundReason,
          status: 'requested',
          ziina_refund_id: `pending_${Date.now()}`,
        });
      if (error) throw error;
      setRefundAmount('');
      setRefundReason('');
      fetchRefunds();
    } catch {
      // Error, do nothing for now
    } finally {
      setRefundSubmitting(false);
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
            <Card className="animate-slide-in-right" style={{animationDelay: '400ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Refunds
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.payment_intent_id && (
                  <div className="mb-3">
                    <div className="text-xs text-muted-foreground">Payment Intent ID:</div>
                    <div className="font-mono text-sm">{order.payment_intent_id}</div>
                  </div>
                )}
                <form onSubmit={handleRefund} className="flex flex-col gap-2 mb-3">
                  <label>
                    Amount
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      required
                      min="0.01"
                      step="0.01"
                      max={order.total_amount}
                      value={refundAmount}
                      onChange={e => setRefundAmount(e.target.value)}
                    />
                  </label>
                  <label>
                    Reason
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      required
                      value={refundReason}
                      onChange={e => setRefundReason(e.target.value)}
                    />
                  </label>
                  <Button type="submit" disabled={refundSubmitting || !order.payment_intent_id} className="w-full">
                    {refundSubmitting ? 'Submitting...' : 'Request Refund'}
                  </Button>
                </form>
                <div className="mt-3">
                  <div className="font-semibold text-xs mb-1">Previous Refunds:</div>
                  <div className="flex flex-col gap-2">
                    {refunds.length === 0 && <div className="text-xs text-muted-foreground">None</div>}
                    {refunds.map((r) => (
                      <div key={r.id} className="text-xs border p-2 rounded">
                        AED {r.amount} • Reason: <b>{r.reason}</b> • Status: <span className="badge">{r.status}</span>
                        <div className="text-muted-foreground font-mono">{r.ziina_refund_id}</div>
                        <div>{new Date(r.created_at).toLocaleString()}</div>
                      </div>
                    ))}
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

export default AdminOrderDetails;
