
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Eye, Users, MousePointer, Clock, TrendingUp, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PageView {
  path: string;
  views: number;
}

interface ReferrerData {
  referrer: string;
  count: number;
}

interface TrafficData {
  date: string;
  views: number;
  visitors: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminTraffic = () => {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [referrers, setReferrers] = useState<ReferrerData[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrafficData();
  }, []);

  const fetchTrafficData = async () => {
    try {
      // Fetch page views
      const { data: viewsData, error: viewsError } = await supabase
        .from('page_views')
        .select('path, timestamp, session_id, referrer')
        .order('timestamp', { ascending: false });

      if (viewsError) throw viewsError;

      // Process page views data
      const pageViewsCount: Record<string, number> = {};
      const referrersCount: Record<string, number> = {};
      const dailyViews: Record<string, { views: number; sessions: Set<string> }> = {};
      const uniqueSessions = new Set<string>();

      (viewsData || []).forEach(view => {
        // Count page views
        pageViewsCount[view.path] = (pageViewsCount[view.path] || 0) + 1;
        
        // Count referrers
        const referrer = view.referrer || 'Direct';
        referrersCount[referrer] = (referrersCount[referrer] || 0) + 1;
        
        // Track unique sessions
        if (view.session_id) {
          uniqueSessions.add(view.session_id);
        }
        
        // Daily traffic
        const date = new Date(view.timestamp).toISOString().split('T')[0];
        if (!dailyViews[date]) {
          dailyViews[date] = { views: 0, sessions: new Set() };
        }
        dailyViews[date].views++;
        if (view.session_id) {
          dailyViews[date].sessions.add(view.session_id);
        }
      });

      // Convert to arrays and sort
      const pageViewsArray: PageView[] = Object.entries(pageViewsCount)
        .map(([path, views]) => ({ path, views: Number(views) }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      const referrersArray: ReferrerData[] = Object.entries(referrersCount)
        .map(([referrer, count]) => ({ referrer, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Generate traffic data for last 7 days
      const last7Days: TrafficData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayData = dailyViews[dateStr];
        
        last7Days.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: dayData?.views || 0,
          visitors: dayData?.sessions.size || 0
        });
      }

      setPageViews(pageViewsArray);
      setReferrers(referrersArray);
      setTrafficData(last7Days);
      setTotalViews(viewsData?.length || 0);
      setUniqueVisitors(uniqueSessions.size);
    } catch (error: any) {
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Traffic Analytics</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Unique sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time on Site</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2m 34s</div>
              <p className="text-xs text-muted-foreground">Estimated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42%</div>
              <p className="text-xs text-muted-foreground">Estimated</p>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" name="Page Views" />
                <Line type="monotone" dataKey="visitors" stroke="#82ca9d" name="Visitors" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pageViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="path" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={referrers}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ referrer, percent }) => `${referrer} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {referrers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Page Views */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pageViews.map((page, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                  <span className="font-medium">{page.path}</span>
                  <span className="text-muted-foreground">{page.views} views</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTraffic;
