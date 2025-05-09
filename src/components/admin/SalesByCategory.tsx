
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SalesData {
  category: string;
  sales: number;
  orders: number;
  color: string;
}

// Custom Tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-md shadow-md">
        <p className="font-medium text-sm">{`${label}`}</p>
        <p className="text-sm text-zyra-purple">
          {`Sales: $${typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : payload[0].value}`}
        </p>
        <p className="text-sm text-gray-600">
          {`Orders: ${payload[1].value}`}
        </p>
      </div>
    );
  }

  return null;
};

const SalesByCategory = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<string>("30");
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);
  const { toast } = useToast();
  
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a4de6c",
    "#d0ed57",
  ];

  useEffect(() => {
    const fetchSalesByCategory = async () => {
      try {
        setIsLoading(true);
        
        // Calculate the start date based on the selected time range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeRange));
        
        // Fetch orders within the time range, along with their items and related products
        const { data: orders, error } = await supabase
          .from("orders")
          .select(`
            id, 
            total_amount, 
            created_at,
            order_items (
              product_id,
              quantity,
              price,
              products:product_id (
                category
              )
            )
          `)
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // If no orders found
        if (!orders || orders.length === 0) {
          setSalesData([]);
          setTotalOrders(0);
          setTotalSales(0);
          setIsLoading(false);
          return;
        }
        
        // Calculate sales by category
        const categorySales: Record<string, { sales: number; orders: number }> = {};
        
        // Process each order
        orders.forEach((order) => {
          const orderItems = order.order_items || [];
          
          // Process each order item
          orderItems.forEach((item: any) => {
            const category = item.products?.category || "Uncategorized";
            const itemTotal = Number(item.price) * Number(item.quantity);
            
            // Initialize or update category data
            if (!categorySales[category]) {
              categorySales[category] = { sales: 0, orders: 0 };
            }
            
            categorySales[category].sales += itemTotal;
            categorySales[category].orders += 1;
          });
        });
        
        // Convert to array for chart
        const chartData: SalesData[] = Object.keys(categorySales).map((category, index) => ({
          category,
          sales: categorySales[category].sales,
          orders: categorySales[category].orders,
          color: colors[index % colors.length],
        }));
        
        // Sort by sales amount (highest first)
        chartData.sort((a, b) => b.sales - a.sales);
        
        // Calculate totals
        const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
        const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);
        
        setSalesData(chartData);
        setTotalOrders(totalOrders);
        setTotalSales(totalSales);
      } catch (error: any) {
        console.error("Error fetching sales by category:", error);
        toast({
          title: "Error fetching sales data",
          description: error.message,
          variant: "destructive",
        });
        
        // Set empty data on error
        setSalesData([]);
        setTotalOrders(0);
        setTotalSales(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesByCategory();
    
    // Set up realtime subscription for order updates
    const channel = supabase
      .channel('orders-sales-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        fetchSalesByCategory();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [timeRange, toast]);

  // Format dollar amounts for display
  const formatDollarAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // If no data available
  if (!isLoading && salesData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Sales by Category</h3>
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
        
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>No sales data available for the selected period</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Sales by Category</h3>
        <select
          className="border rounded-md px-2 py-1 text-sm"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          disabled={isLoading}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>
      
      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zyra-purple"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border rounded-md p-4">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-xl font-medium">{formatDollarAmount(totalSales)}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-medium">{totalOrders}</p>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  name="Sales ($)"
                  dataKey="sales"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                >
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Bar
                  yAxisId="right"
                  name="Orders"
                  dataKey="orders"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesByCategory;
