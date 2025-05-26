
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: Array<{
    product_id: string;
    product_name: string;
    sales_count: number;
  }>;
}

export const useAnalytics = (dateRange?: { start: Date; end: Date }) => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    topProducts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch page views
      const { count: pageViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });

      // Fetch unique visitors
      const { data: uniqueVisitorsData } = await supabase
        .from('page_views')
        .select('user_id')
        .not('user_id', 'is', null);

      const uniqueVisitors = new Set(uniqueVisitorsData?.map(v => v.user_id)).size;

      // Fetch orders for conversion rate and AOV
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, user_id')
        .eq('payment_status', 'paid');

      const totalOrders = orders?.length || 0;
      const totalUsers = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const conversionRate = totalUsers.count ? (totalOrders / totalUsers.count) * 100 : 0;
      const averageOrderValue = totalOrders > 0 
        ? (orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0) / totalOrders
        : 0;

      // Fetch top products (mock data for now)
      const topProducts = [
        { product_id: '1', product_name: 'Premium T-Shirt', sales_count: 25 },
        { product_id: '2', product_name: 'Custom Mug', sales_count: 18 },
        { product_id: '3', product_name: 'Canvas Bag', sales_count: 12 }
      ];

      setData({
        pageViews: pageViews || 0,
        uniqueVisitors,
        conversionRate: Number(conversionRate.toFixed(2)),
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        topProducts
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch: fetchAnalytics };
};
