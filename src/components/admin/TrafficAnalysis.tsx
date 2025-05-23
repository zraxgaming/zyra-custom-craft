
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const TrafficAnalysis: React.FC = () => {
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    topPages: [] as { path: string; views: number }[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // For now, we'll use mock data since page_views table may not have data yet
        // In the future, this would query the page_views table
        setStats({
          totalViews: 1234,
          uniqueVisitors: 456,
          topPages: [
            { path: "/", views: 500 },
            { path: "/shop", views: 300 },
            { path: "/products/example", views: 200 },
            { path: "/contact", views: 100 },
            { path: "/about", views: 50 }
          ]
        });
      } catch (error: any) {
        console.error("Error fetching analytics:", error);
        toast({
          title: "Error fetching analytics",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [toast]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zyra-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-2xl font-bold text-zyra-purple">{stats.totalViews}</div>
            <div className="text-sm text-muted-foreground">Total Page Views</div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-2xl font-bold text-zyra-purple">{stats.uniqueVisitors}</div>
            <div className="text-sm text-muted-foreground">Unique Visitors</div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Top Pages</h4>
          <div className="space-y-2">
            {stats.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{page.path}</span>
                <span className="font-medium">{page.views} views</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrafficAnalysis;
