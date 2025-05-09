
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch the 5 most recent orders
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id,
            total_amount,
            status,
            created_at,
            profiles (
              display_name,
              avatar_url
            )
          `)
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (error) {
          console.error("Error fetching recent orders:", error);
          throw error;
        }
        
        setOrders(data || []);
      } catch (error: any) {
        console.error("Error fetching recent orders:", error);
        toast({
          title: "Error fetching orders",
          description: error.message || "Could not load recent orders",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
    
    // Set up real-time subscription for order updates
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        fetchOrders();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No orders found. Orders will appear here when customers make purchases.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {order.profiles?.display_name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{order.profiles?.display_name || "Customer"}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">${order.total_amount}</p>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                order.status === "completed" || order.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : order.status === "processing" || order.status === "shipped"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrders;
