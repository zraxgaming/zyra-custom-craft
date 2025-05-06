
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PageView {
  page: string;
  views: number;
  timestamp: string;
  date: string;
}

interface TrafficData {
  name: string;
  pageViews: number;
  uniqueVisitors: number;
}

const TrafficAnalysis = () => {
  const [trafficsData, setTrafficsData] = useState<TrafficData[]>([]);
  const [pageVisits, setPageVisits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // In a real implementation, this would fetch from a page_views table
    // For demo purposes, we're creating mock data
    const fetchTrafficData = async () => {
      try {
        // Mock data for demonstration
        const mockTrafficData: TrafficData[] = [
          { name: 'Mon', pageViews: 150, uniqueVisitors: 90 },
          { name: 'Tue', pageViews: 230, uniqueVisitors: 120 },
          { name: 'Wed', pageViews: 280, uniqueVisitors: 150 },
          { name: 'Thu', pageViews: 270, uniqueVisitors: 140 },
          { name: 'Fri', pageViews: 300, uniqueVisitors: 170 },
          { name: 'Sat', pageViews: 380, uniqueVisitors: 200 },
          { name: 'Sun', pageViews: 340, uniqueVisitors: 180 },
        ];

        const mockPageVisits: Record<string, number> = {
          '/': 450,
          '/shop': 380,
          '/products': 250,
          '/auth': 120,
          '/cart': 180,
        };

        setTrafficsData(mockTrafficData);
        setPageVisits(mockPageVisits);
      } catch (error: any) {
        toast({
          title: "Error fetching analytics data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrafficData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Website Traffic</CardTitle>
          <CardDescription>Daily page views and unique visitors over the last week</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trafficsData}
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
              <Legend />
              <Line 
                type="monotone" 
                dataKey="pageViews" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Page Views" 
              />
              <Line 
                type="monotone" 
                dataKey="uniqueVisitors" 
                stroke="#82ca9d" 
                name="Unique Visitors" 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Visited Pages</CardTitle>
          <CardDescription>Views by page path</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(pageVisits).map(([page, count], index) => (
              <div key={page} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-zyra-purple mr-2" />
                  <span className="text-sm font-medium">{page}</span>
                </div>
                <span className="font-semibold">{count} views</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficAnalysis;
