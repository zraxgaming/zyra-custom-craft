
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Eye, 
  Users, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet,
  TrendingUp,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrafficData {
  totalViews: number;
  uniqueVisitors: number;
  dailyViews: any[];
  topPages: any[];
  referrers: any[];
  devices: any[];
  hourlyViews: any[];
}

const AdminTraffic = () => {
  const [trafficData, setTrafficData] = useState<TrafficData>({
    totalViews: 0,
    uniqueVisitors: 0,
    dailyViews: [],
    topPages: [],
    referrers: [],
    devices: [],
    hourlyViews: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const { toast } = useToast();

  useEffect(() => {
    fetchTrafficData();
  }, [dateRange]);

  const fetchTrafficData = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const now = new Date();
      const daysBack = dateRange === '24h' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

      // Fetch page views
      const { data: pageViews, error: viewsError } = await supabase
        .from('page_views')
        .select('*')
        .gte('timestamp', startDate.toISOString());

      if (viewsError) throw viewsError;

      const views = pageViews || [];
      
      // Process data
      const totalViews = views.length;
      const uniqueVisitors = new Set(views.map(v => v.session_id || v.user_id).filter(Boolean)).size;

      // Daily views for chart
      const dailyViewsMap = new Map();
      views.forEach(view => {
        const date = new Date(view.timestamp).toISOString().split('T')[0];
        dailyViewsMap.set(date, (dailyViewsMap.get(date) || 0) + 1);
      });

      const dailyViews = Array.from(dailyViewsMap.entries())
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Top pages
      const pageCountMap = new Map();
      views.forEach(view => {
        const path = view.path || '/';
        pageCountMap.set(path, (pageCountMap.get(path) || 0) + 1);
      });

      const topPages = Array.from(pageCountMap.entries())
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Referrers
      const referrerMap = new Map();
      views.forEach(view => {
        const referrer = view.referrer || 'Direct';
        const domain = referrer === 'Direct' ? 'Direct' : 
                      referrer.includes('google') ? 'Google' :
                      referrer.includes('facebook') ? 'Facebook' :
                      referrer.includes('twitter') ? 'Twitter' :
                      referrer.includes('instagram') ? 'Instagram' :
                      new URL(referrer).hostname;
        referrerMap.set(domain, (referrerMap.get(domain) || 0) + 1);
      });

      const referrers = Array.from(referrerMap.entries())
        .map(([source, views]) => ({ source, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Device types (simplified)
      const deviceMap = new Map();
      views.forEach(view => {
        const userAgent = view.user_agent || '';
        let device = 'Desktop';
        if (userAgent.includes('Mobile')) device = 'Mobile';
        else if (userAgent.includes('Tablet')) device = 'Tablet';
        
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
      });

      const devices = Array.from(deviceMap.entries())
        .map(([device, count]) => ({ device, count }));

      // Hourly views (last 24 hours only)
      const hourlyViewsMap = new Map();
      const last24Hours = views.filter(view => 
        new Date(view.timestamp) > new Date(now.getTime() - 24 * 60 * 60 * 1000)
      );
      
      for (let i = 0; i < 24; i++) {
        hourlyViewsMap.set(i, 0);
      }
      
      last24Hours.forEach(view => {
        const hour = new Date(view.timestamp).getHours();
        hourlyViewsMap.set(hour, (hourlyViewsMap.get(hour) || 0) + 1);
      });

      const hourlyViews = Array.from(hourlyViewsMap.entries())
        .map(([hour, views]) => ({ hour: `${hour}:00`, views }));

      setTrafficData({
        totalViews,
        uniqueVisitors,
        dailyViews,
        topPages,
        referrers,
        devices,
        hourlyViews
      });

    } catch (error) {
      console.error('Error fetching traffic data:', error);
      toast({
        title: "Error",
        description: "Failed to load traffic data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deviceColors = ['#8b5cf6', '#ec4899', '#06b6d4'];
  const deviceIcons = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
              Traffic Analytics
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Monitor your website's performance and visitor behavior
            </p>
          </div>
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  dateRange === range
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {range === '24h' ? 'Last 24h' : `Last ${range}`}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-3d-lift animate-scale-in border-gradient">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{trafficData.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Page views in selected period
              </p>
            </CardContent>
          </Card>

          <Card className="hover-3d-lift animate-scale-in border-gradient" style={{animationDelay: '100ms'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{trafficData.uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Unique sessions tracked
              </p>
            </CardContent>
          </Card>

          <Card className="hover-3d-lift animate-scale-in border-gradient" style={{animationDelay: '200ms'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Views/Visitor</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {trafficData.uniqueVisitors > 0 ? (trafficData.totalViews / trafficData.uniqueVisitors).toFixed(1) : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Pages per session
              </p>
            </CardContent>
          </Card>

          <Card className="hover-3d-lift animate-scale-in border-gradient" style={{animationDelay: '300ms'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Period</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dateRange}</div>
              <p className="text-xs text-muted-foreground">
                Selected time range
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Views Chart */}
          <Card className="animate-slide-in-left card-premium border-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-blue-600" />
                {dateRange === '24h' ? 'Hourly Views' : 'Daily Views'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dateRange === '24h' ? trafficData.hourlyViews : trafficData.dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey={dateRange === '24h' ? 'hour' : 'date'} 
                    fontSize={12}
                    tickFormatter={(value) => dateRange === '24h' ? value : new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    labelFormatter={(value) => dateRange === '24h' ? `${value}` : new Date(value).toLocaleDateString()}
                    formatter={(value) => [value, 'Views']}
                  />
                  <Bar dataKey="views" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card className="animate-slide-in-right card-premium border-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-600" />
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficData.devices}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ device, percent }) => `${device} ${(percent * 100).toFixed(0)}%`}
                    >
                      {trafficData.devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Visits']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {trafficData.devices.map((device, index) => {
                  const Icon = deviceIcons[device.device as keyof typeof deviceIcons] || Monitor;
                  return (
                    <div key={device.device} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: deviceColors[index % deviceColors.length] }}
                      />
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{device.device}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <Card className="animate-slide-in-up card-premium border-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficData.topPages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No page data available</p>
                  </div>
                ) : (
                  trafficData.topPages.map((page, index) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-300 animate-fade-in hover-magnetic"
                      style={{animationDelay: `${index * 50}ms`}}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium truncate max-w-xs">{page.path}</p>
                          <p className="text-xs text-muted-foreground">{page.views} views</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {((page.views / trafficData.totalViews) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="animate-slide-in-up card-premium border-gradient" style={{animationDelay: '200ms'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficData.referrers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No referrer data available</p>
                  </div>
                ) : (
                  trafficData.referrers.map((referrer, index) => (
                    <div
                      key={referrer.source}
                      className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-300 animate-fade-in hover-magnetic"
                      style={{animationDelay: `${index * 50}ms`}}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{referrer.source}</p>
                          <p className="text-xs text-muted-foreground">{referrer.views} visits</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {((referrer.views / trafficData.totalViews) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTraffic;
