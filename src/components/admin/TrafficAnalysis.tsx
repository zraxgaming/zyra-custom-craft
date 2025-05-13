
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

const TrafficAnalysis = () => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrafficData = async () => {
      setLoading(true);
      try {
        // Using the page_views table directly - make sure this exists in your database
        const { data, error } = await supabase
          .from('page_views')
          .select('path, timestamp')
          .order('timestamp', { ascending: false })
          .limit(500);

        if (error) throw error;

        // Process data to count visits per page path
        const pageViews = (data || []).reduce((acc: any, item: any) => {
          const path = item.path || 'unknown';
          if (!acc[path]) acc[path] = 0;
          acc[path]++;
          return acc;
        }, {});

        // Convert to chart format
        const chartData = Object.entries(pageViews).map(([path, count]) => ({
          page: path.length > 15 ? path.substring(0, 15) + '...' : path,
          views: count,
          fullPath: path
        })).sort((a, b) => (b.views as number) - (a.views as number)).slice(0, 10);

        setTrafficData(chartData);
      } catch (error) {
        console.error('Error fetching traffic data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrafficData();
  }, []);

  return (
    <Card className="col-span-full xl:col-span-2">
      <CardHeader>
        <CardTitle>Page Visit Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        ) : trafficData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={trafficData}>
              <XAxis 
                dataKey="page" 
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  background: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name, props) => [`${value} views`, props.payload.fullPath]}
                labelFormatter={() => 'Page Path'}
              />
              <Bar 
                dataKey="views" 
                fill="#6a0dad" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex flex-col items-center justify-center text-gray-500">
            <p>No traffic data available yet.</p>
            <p className="text-sm mt-2">Page visits will be recorded as users browse your site.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrafficAnalysis;
