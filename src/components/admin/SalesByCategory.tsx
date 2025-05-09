
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
        // Get order items with products and sum by category
        const { data: orderItemsData, error: orderItemsError } = await supabase
          .from('order_items')
          .select(`
            quantity,
            price,
            product:product_id (
              category
            )
          `);
        
        if (orderItemsError) throw orderItemsError;
        
        // Process data to get sales by category
        const categorySales: Record<string, number> = {};
        
        if (orderItemsData && orderItemsData.length > 0) {
          orderItemsData.forEach((item: any) => {
            const category = item.product?.category || 'Uncategorized';
            const saleAmount = item.quantity * item.price;
            categorySales[category] = (categorySales[category] || 0) + saleAmount;
          });
          
          // Get category names instead of slugs
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('slug, name');
          
          if (categoryError) throw categoryError;

          // Map category slugs to names
          const categoryMap: Record<string, string> = {};
          if (categoryData) {
            categoryData.forEach((cat: any) => {
              categoryMap[cat.slug] = cat.name;
            });
          }
          
          // Transform to proper format for chart
          const formattedData = Object.entries(categorySales)
            .map(([slug, value]) => ({ 
              name: categoryMap[slug] || slug,
              value 
            }))
            .sort((a, b) => b.value - a.value);
          
          setData(formattedData);
        } else {
          // If no orders yet, get product counts by category
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('category');
          
          if (productsError) throw productsError;
          
          const categoryCounts: Record<string, number> = {};
          
          if (productsData && productsData.length > 0) {
            productsData.forEach((item: any) => {
              const category = item.category || 'Uncategorized';
              categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
            
            // Get category names instead of slugs
            const { data: categoryData, error: categoryError } = await supabase
              .from('categories')
              .select('slug, name');
            
            if (categoryError) throw categoryError;
  
            // Map category slugs to names
            const categoryMap: Record<string, string> = {};
            if (categoryData) {
              categoryData.forEach((cat: any) => {
                categoryMap[cat.slug] = cat.name;
              });
            }
            
            // Transform to proper format for chart
            const formattedData = Object.entries(categoryCounts)
              .map(([slug, value]) => ({ 
                name: categoryMap[slug] || slug,
                value 
              }))
              .sort((a, b) => b.value - a.value);
            
            setData(formattedData);
          } else {
            setData([]);
          }
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
    
    // Set up real-time subscription
    const channel = supabase
      .channel('sales-by-category-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'order_items' 
      }, () => {
        fetchCategorySales();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, () => {
        fetchCategorySales();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'categories' 
      }, () => {
        fetchCategorySales();
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
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SalesByCategory;
