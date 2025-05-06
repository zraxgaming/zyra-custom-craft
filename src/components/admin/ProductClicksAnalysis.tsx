
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
    // For demo purposes, we're creating mock data
    const fetchProductClicks = async () => {
      try {
        // Get some actual products from the database for more realistic mock data
        const { data: productsData, error } = await supabase
          .from('products')
          .select('id, name')
          .limit(5);
        
        if (error) throw error;
        
        // Create mock click data for these products
        const mockClicks: ProductClick[] = productsData.map((product, index) => ({
          product_id: product.id,
          product_name: product.name,
          clicks: Math.floor(Math.random() * 500) + 100, // Random clicks between 100-600
        }));
        
        // Sort by clicks in descending order
        mockClicks.sort((a, b) => b.clicks - a.clicks);
        
        setProductClicks(mockClicks);
      } catch (error: any) {
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

  const chartData = productClicks.map(item => ({
    name: item.product_name.length > 15 ? item.product_name.substring(0, 15) + '...' : item.product_name,
    clicks: item.clicks
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Clicks Analysis</CardTitle>
        <CardDescription>Most viewed products by click count</CardDescription>
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
              <TableHead className="text-right">Click Count</TableHead>
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
