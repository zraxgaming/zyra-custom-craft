
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Eye, Globe, Clock, Smartphone, Monitor, Tablet } from "lucide-react";

interface PageView {
  id: string;
  path: string;
  user_id: string | null;
  session_id: string | null;
  referrer: string | null;
  user_agent: string | null;
  timestamp: string;
}

const AdminTraffic = () => {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    topPages: [] as any[],
    deviceTypes: [] as any[],
    trafficSources: [] as any[]
  });

  useEffect(() => {
    fetchTrafficData();
  }, []);

  const fetchTrafficData = async () => {
    try {
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const views = data || [];
      setPageViews(views);

      // Calculate statistics
      const totalViews = views.length;
      const uniqueVisitors = new Set(views.map(v => v.session_id || v.user_id).filter(Boolean)).size;

      // Top pages
      const pageStats = views.reduce((acc: any, view) => {
        const path = view.path || '/';
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      }, {});

      const topPages = Object.entries(pageStats)
        .map(([path, views]) => ({ path, views }))
        .sort((a: any, b: any) => b.views - a.views)
        .slice(0, 10);

      // Device types (simplified)
      const deviceStats = views.reduce((acc: any, view) => {
        const userAgent = view.user_agent || '';
        let device = 'Desktop';
        if (userAgent.includes('Mobile')) device = 'Mobile';
        else if (userAgent.includes('Tablet')) device = 'Tablet';
        
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {});

      const deviceTypes = Object.entries(deviceStats).map(([device, count]) => ({
        device,
        count,
        percentage: Math.round((count as number / totalViews) * 100)
      }));

      // Traffic sources
      const sourceStats = views.reduce((acc: any, view) => {
        const referrer = view.referrer || 'Direct';
        let source = 'Direct';
        if (referrer.includes('google')) source = 'Google';
        else if (referrer.includes('facebook')) source = 'Facebook';
        else if (referrer.includes('twitter')) source = 'Twitter';
        else if (referrer !== 'Direct') source = 'Other';
        
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      const trafficSources = Object.entries(sourceStats).map(([source, count]) => ({
        source,
        count,
        percentage: Math.round((count as number / totalViews) * 100)
      }));

      setStats({
        totalViews,
        uniqueVisitors,
        topPages,
        deviceTypes,
        trafficSources
      });
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        <div className="relative z-10 p-6 space-y-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative mb-8">
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                <TrendingUp className="h-5 w-5 mr-3" />
                Traffic Analytics
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
              Website Traffic
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
              Analyze visitor behavior and traffic patterns to optimize your website performance.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800 shadow-xl animate-slide-in-left">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">{stats.totalViews.toLocaleString()}</h3>
                <p className="text-blue-600 dark:text-blue-500">Page Views</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 shadow-xl animate-scale-in" style={{animationDelay: '100ms'}}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">{stats.uniqueVisitors.toLocaleString()}</h3>
                <p className="text-green-600 dark:text-green-500">Unique Visitors</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800 shadow-xl animate-scale-in" style={{animationDelay: '200ms'}}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-2">{stats.topPages.length}</h3>
                <p className="text-purple-600 dark:text-purple-500">Pages Visited</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-800 shadow-xl animate-slide-in-right" style={{animationDelay: '300ms'}}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-2">2.5m</h3>
                <p className="text-orange-600 dark:text-orange-500">Avg. Session</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Pages */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-2xl animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.topPages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="path" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Types */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-2xl animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Device Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.deviceTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, percentage }) => `${device} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.deviceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Traffic Sources */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-2xl animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.trafficSources.map((source, index) => (
                  <div key={source.source} className="text-center p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-lg">{source.source}</h3>
                    <p className="text-2xl font-bold text-primary">{source.count}</p>
                    <p className="text-sm text-muted-foreground">{source.percentage}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-2xl animate-slide-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Page Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pageViews.slice(0, 20).map((view, index) => (
                  <div key={view.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
                    <div className="flex-1">
                      <p className="font-medium">{view.path}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(view.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {view.user_id ? 'User' : 'Guest'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTraffic;
