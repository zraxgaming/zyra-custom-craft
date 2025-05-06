
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CategorySale {
  name: string;
  value: number;
}

const COLORS = ["#6a0dad", "#8a2be2", "#9933ff", "#ad5fff", "#c299ff"];

const SalesByCategory = () => {
  const [data, setData] = useState<CategorySale[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategorySales = async () => {
      try {
        // First try to get data from orders
        const { data: orderItems, error: orderError } = await supabase
          .from('order_items')
          .select(`
            quantity,
            product:product_id (
              category
            )
          `);
        
        if (orderError) throw orderError;
        
        // Process data to get sales by category
        const categoryCounts: Record<string, number> = {};
        
        if (orderItems && orderItems.length > 0) {
          orderItems.forEach(item => {
            const category = item.product?.category;
            if (category) {
              if (categoryCounts[category]) {
                categoryCounts[category] += item.quantity;
              } else {
                categoryCounts[category] = item.quantity;
              }
            }
          });
        } else {
          // Fallback to products if no orders
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('category');
          
          if (productsError) throw productsError;
          
          productsData.forEach(item => {
            if (categoryCounts[item.category]) {
              categoryCounts[item.category]++;
            } else {
              categoryCounts[item.category] = 1;
            }
          });
        }
        
        // Transform to proper format for chart
        const formattedData = Object.entries(categoryCounts).map(([name, value]) => ({
          name,
          value
        }));
        
        setData(formattedData);
      } catch (error: any) {
        toast({
          title: "Error fetching sales data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategorySales();
    
    // Set up real-time subscription for updates
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'order_items' 
      }, () => {
        fetchCategorySales(); // Refresh data when orders change
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No sales data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} items`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SalesByCategory;
