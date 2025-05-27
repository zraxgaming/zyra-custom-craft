
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, Eye, TrendingUp, Globe, Smartphone, Monitor, Tablet } from "lucide-react";

const AdminTrafficDashboard = () => {
  const { data: pageViews, isLoading } = useQuery({
    queryKey: ['admin-page-views'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-traffic-stats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      const [todayViews, yesterdayViews, uniqueUsers, totalViews] = await Promise.all([
        supabase.from('page_views').select('id', { count: 'exact' }).gte('timestamp', today),
        supabase.from('page_views').select('id', { count: 'exact' }).gte('timestamp', yesterday).lt('timestamp', today),
        supabase.from('page_views').select('user_id').not('user_id', 'is', null),
        supabase.from('page_views').select('id', { count: 'exact' })
      ]);

      return {
        todayViews: todayViews.count || 0,
        yesterdayViews: yesterdayViews.count || 0,
        uniqueUsers: new Set(uniqueUsers.data?.map(v => v.user_id)).size,
        totalViews: totalViews.count || 0
      };
    },
  });

  const topPages = pageViews?.reduce((acc, view) => {
    acc[view.path] = (acc[view.path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPagesArray = Object.entries(topPages || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-purple-600" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Traffic Analytics
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="animate-slide-in-left">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Today's Views</p>
                <p className="text-2xl font-bold">{stats?.todayViews || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-left" style={{animationDelay: '0.1s'}}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yesterday's Views</p>
                <p className="text-2xl font-bold">{stats?.yesterdayViews || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-left" style={{animationDelay: '0.2s'}}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Users</p>
                <p className="text-2xl font-bold">{stats?.uniqueUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-left" style={{animationDelay: '0.3s'}}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold">{stats?.totalViews || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card className="animate-slide-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Top Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPagesArray.map(([path, views], index) => (
              <div key={path} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span className="font-medium">{path}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{views} views</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Recent Page Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pageViews?.slice(0, 20).map((view, index) => (
              <div key={view.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {view.user_agent?.includes('Mobile') ? (
                      <Smartphone className="h-4 w-4 text-gray-500" />
                    ) : view.user_agent?.includes('Tablet') ? (
                      <Tablet className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Monitor className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{view.path}</p>
                    {view.referrer && (
                      <p className="text-sm text-gray-500">From: {view.referrer}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(view.timestamp).toLocaleString()}
                  </p>
                  {view.user_id && (
                    <Badge variant="outline" className="text-xs">Authenticated</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTrafficDashboard;
