
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
        // Get all products grouped by category
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('category');
        
        if (productsError) throw productsError;
        
        // Process data to get counts by category
        const categoryCounts: Record<string, number> = {};
        
        if (productsData && productsData.length > 0) {
          productsData.forEach((item: any) => {
            const category = item.category || 'Uncategorized';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
          
          // Transform to proper format for chart
          const formattedData = Object.entries(categoryCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
          
          setData(formattedData);
        } else {
          setData([]);
        }
      } catch (error: any) {
        console.error("Error fetching category data:", error);
        toast({
          title: "Error fetching category data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategorySales();
    
    // Set up real-time subscription for updates to products
    const channel = supabase
      .channel('product-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, () => {
        fetchCategorySales(); // Refresh data when products change
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
        <p className="text-gray-500">No product category data available</p>
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
        <Tooltip formatter={(value) => `${value} products`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SalesByCategory;
