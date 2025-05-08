
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProductClick {
  product_id: string;
  product_name: string;
  clicks: number;
}

const ProductClicksAnalysis = () => {
  const [productClicks, setProductClicks] = useState<ProductClick[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // In a real implementation, this would fetch from a product_clicks table
    const fetchProductClicks = async () => {
      try {
        // Get real products from the database
        const { data: productsData, error } = await supabase
          .from('products')
          .select('id, name')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        if (productsData && productsData.length > 0) {
          // Create analytics data for these products
          // In a real app this would come from actual tracked clicks
          const mockClicks: ProductClick[] = productsData.map((product: any) => ({
            product_id: product.id,
            product_name: product.name || 'Unnamed Product',
            clicks: Math.floor(Math.random() * 500) + 100, // Random clicks between 100-600
          }));
          
          // Sort by clicks in descending order
          mockClicks.sort((a, b) => b.clicks - a.clicks);
          
          setProductClicks(mockClicks);
        } else {
          // No products found
          setProductClicks([]);
        }
      } catch (error: any) {
        console.error("Error fetching product clicks data:", error);
        toast({
          title: "Error fetching product clicks data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductClicks();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }

  // Handle case where no products exist yet
  if (productClicks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Clicks Analysis</CardTitle>
          <CardDescription>No products available for analysis</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">
            Add products to your store to see click analytics here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = productClicks.map(item => ({
    name: item.product_name.length > 15 ? item.product_name.substring(0, 15) + '...' : item.product_name,
    clicks: item.clicks
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Clicks Analysis</CardTitle>
          <CardDescription>Sample data based on your products</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#6a0dad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Sample Click Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productClicks.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell className="font-medium">{product.product_name}</TableCell>
                <TableCell className="text-right">{product.clicks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductClicksAnalysis;
