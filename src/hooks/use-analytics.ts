
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface PageView {
  id: string;
  path: string;
  user_id?: string;
  timestamp: string;
  user_agent?: string;
  referrer?: string;
  session_id?: string;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topPages: { path: string; views: number }[];
  dailyViews: { date: string; views: number }[];
}

export const useAnalytics = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ["analytics", dateRange],
    queryFn: async () => {
      let query = supabase
        .from("page_views")
        .select("*");

      if (dateRange) {
        query = query
          .gte("timestamp", dateRange.from.toISOString())
          .lte("timestamp", dateRange.to.toISOString());
      }

      const { data: views, error } = await query;

      if (error) throw error;

      // Process analytics data
      const totalViews = views.length;
      const uniqueVisitors = new Set(views.map(v => v.user_id || v.session_id)).size;
      
      // Top pages
      const pageViewCounts = views.reduce((acc, view) => {
        acc[view.path] = (acc[view.path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topPages = Object.entries(pageViewCounts)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Daily views
      const dailyViewCounts = views.reduce((acc, view) => {
        const date = new Date(view.timestamp).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dailyViews = Object.entries(dailyViewCounts)
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalViews,
        uniqueVisitors,
        topPages,
        dailyViews
      } as AnalyticsData;
    },
  });
};

export const useTrackPageView = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (path: string) => {
      const sessionId = sessionStorage.getItem('session_id') || 
        (() => {
          const id = Math.random().toString(36).substring(7);
          sessionStorage.setItem('session_id', id);
          return id;
        })();

      const { error } = await supabase
        .from("page_views")
        .insert({
          path,
          user_id: user?.id,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          session_id: sessionId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};
