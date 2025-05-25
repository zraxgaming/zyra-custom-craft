import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Eye, Users, Clock, TrendingUp, Globe, MousePointer } from "lucide-react";

interface AnalyticsData {
  id: string;
  page_path: string;
  views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  date: string;
}

const PageAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Using mock data since we can't query the analytics table directly yet
      const mockData: AnalyticsData[] = [
        {
          id: "1",
          page_path: "/",
          views: 1250,
          unique_visitors: 890,
          bounce_rate: 0.35,
          avg_session_duration: 180,
          date: new Date().toISOString()
        },
        {
          id: "2", 
          page_path: "/shop",
          views: 856,
          unique_visitors: 645,
          bounce_rate: 0.28,
          avg_session_duration: 240,
          date: new Date().toISOString()
        },
        {
          id: "3",
          page_path: "/products/custom-iphone-case",
          views: 234,
          unique_visitors: 198,
          bounce_rate: 0.22,
          avg_session_duration: 320,
          date: new Date().toISOString()
        }
      ];
      
      setAnalytics(mockData);
    } catch (error: any) {
      toast({
        title: "Error fetching analytics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalViews = analytics.reduce((sum, item) => sum + item.views, 0);
  const totalUniqueVisitors = analytics.reduce((sum, item) => sum + item.unique_visitors, 0);
  const avgBounceRate = analytics.length > 0 ? analytics.reduce((sum, item) => sum + item.bounce_rate, 0) / analytics.length : 0;
  const avgSessionDuration = analytics.length > 0 ? analytics.reduce((sum, item) => sum + item.avg_session_duration, 0) / analytics.length : 0;

  const topPages = analytics
    .reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.page_path === curr.page_path);
      if (existing) {
        existing.views += curr.views;
        existing.unique_visitors += curr.unique_visitors;
      } else {
        acc.push({
          page_path: curr.page_path,
          views: curr.views,
          unique_visitors: curr.unique_visitors,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const dailyViews = analytics
    .slice(0, 7)
    .reverse()
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: item.views,
      visitors: item.unique_visitors,
    }));

  const pageDistribution = topPages.slice(0, 5).map((page, index) => ({
    name: page.page_path === '/' ? 'Home' : page.page_path.replace('/', ''),
    value: page.views,
    color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][index],
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Page Analytics</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{totalUniqueVisitors.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Bounce Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{(avgBounceRate * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 animate-scale-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg. Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{Math.floor(avgSessionDuration / 60)}m {avgSessionDuration % 60}s</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border animate-slide-in-left" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="text-foreground">Daily Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} name="Views" />
                  <Line type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={2} name="Visitors" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border animate-slide-in-right" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle className="text-foreground">Page Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Pages Table */}
      <Card className="bg-card border-border animate-fade-in" style={{ animationDelay: '600ms' }}>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Top Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={page.page_path} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-slide-in-left" style={{ animationDelay: `${700 + index * 50}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{page.page_path === '/' ? 'Home' : page.page_path}</p>
                    <p className="text-sm text-muted-foreground">{page.page_path}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{page.views.toLocaleString()} views</p>
                  <p className="text-sm text-muted-foreground">{page.unique_visitors.toLocaleString()} visitors</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageAnalytics;
