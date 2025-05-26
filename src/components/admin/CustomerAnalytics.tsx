
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Users, Eye, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Customer {
  id: string;
  display_name: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  total_spent: number;
  order_count: number;
  last_order_date: string;
}

const CustomerAnalytics: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Fetch customers with their order data
      const { data: customersData, error: customersError } = await supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          email,
          first_name,
          last_name,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (customersError) throw customersError;

      // Get order statistics for each customer
      const customersWithStats = await Promise.all(
        (customersData || []).map(async (customer) => {
          const { data: orderData } = await supabase
            .from('orders')
            .select('total_amount, created_at')
            .eq('user_id', customer.id)
            .eq('payment_status', 'paid');

          const totalSpent = orderData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
          const orderCount = orderData?.length || 0;
          const lastOrderDate = orderData?.[0]?.created_at || null;

          return {
            ...customer,
            total_spent: totalSpent,
            order_count: orderCount,
            last_order_date: lastOrderDate
          };
        })
      );

      // Get total customer count
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setCustomers(customersWithStats);
      setTotalCustomers(count || 0);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Analytics
          </CardTitle>
          <Badge variant="secondary">
            {totalCustomers} Total Customers
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No customers found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {(customer.display_name || customer.first_name || customer.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {customer.display_name || 
                       `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 
                       'Unknown User'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {customer.email || 'No email'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Joined {format(new Date(customer.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${customer.total_spent.toFixed(2)} spent</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.order_count} orders
                  </p>
                  {customer.last_order_date && (
                    <p className="text-xs text-muted-foreground">
                      Last order: {format(new Date(customer.last_order_date), 'MMM d')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerAnalytics;
