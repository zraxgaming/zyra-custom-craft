
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const RecentOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          profiles (
            display_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No orders yet</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">
              {order.profiles?.display_name || order.profiles?.email || 'Guest'}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.created_at), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">${Number(order.total_amount).toFixed(2)}</p>
            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrders;
