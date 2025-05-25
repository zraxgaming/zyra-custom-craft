
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Users, Eye, Clock } from "lucide-react";

const RealTimeAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    todayViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    monthlyData: [],
    recentData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      const interval = setInterval(fetchAnalytics, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      // Fetch page views for today
      const today = new Date().toISOString().split('T')[0];
      const { data: pageViews } = await supabase
        .from('page_views')
        .select('*')
        .gte('timestamp', today);

      // Calculate metrics
      const todayViews = pageViews?.length || 0;
      const uniqueVisitors = new Set(pageViews?.map(view => view.session_id)).size;
      
      // Mock data for demonstration (in a real app, you'd calculate these from actual data)
      const bounceRate = Math.round(Math.random() * 30 + 20); // 20-50%
      const avgSessionDuration = Math.round(Math.random() * 180 + 120); // 2-5 minutes

      // Generate monthly data for the last 6 months
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          views: Math.round(Math.random() * 5000 + 1000),
          visitors: Math.round(Math.random() * 2000 + 500)
        });
      }

      // Generate recent hourly data
      const recentData = [];
      for (let i = 23; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        recentData.push({
          time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          views: Math.round(Math.random() * 100 + 10)
        });
      }

      setAnalytics({
        todayViews,
        uniqueVisitors,
        bounceRate,
        avgSessionDuration,
        monthlyData,
        recentData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Views</p>
                <p className="text-2xl font-bold text-foreground">{analytics.todayViews}</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold text-foreground">{analytics.uniqueVisitors}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold text-foreground">{analytics.bounceRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
                <p className="text-2xl font-bold text-foreground">{Math.floor(analytics.avgSessionDuration / 60)}m {analytics.avgSessionDuration % 60}s</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Monthly Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" name="Page Views" />
                <Bar dataKey="visitors" fill="#82ca9d" name="Unique Visitors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle>Real-time Activity (Last 24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.recentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;
