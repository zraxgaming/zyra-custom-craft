
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/order";
import AdminLayout from "@/components/admin/AdminLayout";
import { OrdersTable } from "@/components/admin/order/OrdersTable";
import { OrdersStats } from "@/components/admin/order/OrdersStats";
import { OrdersFilters } from "@/components/admin/order/OrdersFilters";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles (
            email,
            first_name,
            last_name
          ),
          order_items (
            id,
            order_id,
            product_id,
            quantity,
            price,
            customization,
            created_at,
            products (
              id,
              name,
              price,
              images,
              slug
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our Order interface
      const transformedOrders: Order[] = (data || []).map((order: any) => ({
        id: order.id,
        user_id: order.user_id || order.profile_id,
        profile_id: order.profile_id,
        total_amount: order.total_amount,
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        shipping_address: order.shipping_address,
        billing_address: order.billing_address,
        currency: order.currency,
        delivery_type: order.delivery_type,
        notes: order.notes,
        tracking_number: order.tracking_number,
        created_at: order.created_at,
        updated_at: order.updated_at,
        profiles: order.profiles,
        order_items: order.order_items?.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization,
          created_at: item.created_at,
          product: item.products
        })) || []
      }));

      setOrders(transformedOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground animate-scale-in">
              Orders Management
            </h1>
            <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
          </div>
        </div>

        <OrdersStats orders={orders} />
        
        <OrdersFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <OrdersTable orders={filteredOrders} onOrderUpdate={fetchOrders} />
      </div>
    </AdminLayout>
  );
};

export default Orders;
