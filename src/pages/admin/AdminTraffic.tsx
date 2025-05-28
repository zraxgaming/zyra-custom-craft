
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Activity, TrendingUp, Users, MousePointer, BarChart3, Calendar, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const AdminTraffic = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [trafficData, setTrafficData] = useState([]);
  const [dateRange, setDateRange] = useState("7days");
  const [stats, setStats] = useState({
    total_views: 0,
    unique_users: 0,
    top_page: { path: "", views: 0 },
    top_referrer: { referrer: "", count: 0 },
    avg_duration: 0
  });
  const [pageViewsChart, setPageViewsChart] = useState([]);
  const [topPagesData, setTopPagesData] = useState([]);

  useEffect(() => {
    fetchTrafficData();
  }, [dateRange]);

  const fetchTrafficData = async () => {
    setLoading(true);
    setStatsLoading(true);
    
    try {
      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case "24hours":
          startDate.setHours(now.getHours() - 24);
          break;
        case "7days":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          startDate.setDate(now.getDate() - 90);
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      }

      // Fetch traffic data
      const { data: pageViews, error } = await supabase
        .from('page_views')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Process data for stats
      setTrafficData(pageViews || []);
      
      // Calculate statistics
      if (pageViews) {
        // Total views
        const totalViews = pageViews.length;
        
        // Unique users
        const uniqueUserIds = new Set(
          pageViews.filter(pv => pv.user_id).map(pv => pv.user_id)
        );
        const uniqueSessionIds = new Set(
          pageViews.filter(pv => pv.session_id).map(pv => pv.session_id)
        );
        const uniqueUsers = uniqueUserIds.size + 
          (pageViews.filter(pv => !pv.user_id && pv.session_id).length > 0 ? uniqueSessionIds.size : 0);

        // Top page
        const pageCountMap = pageViews.reduce((acc, pv) => {
          acc[pv.path] = (acc[pv.path] || 0) + 1;
          return acc;
        }, {});
        
        const topPage = Object.entries(pageCountMap)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .map(([path, views]) => ({ path, views }))[0] || { path: "", views: 0 };

        // Top referrer
        const referrerCountMap = pageViews
          .filter(pv => pv.referrer)
          .reduce((acc, pv) => {
            acc[pv.referrer] = (acc[pv.referrer] || 0) + 1;
            return acc;
          }, {});
        
        const topReferrer = Object.entries(referrerCountMap)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .map(([referrer, count]) => ({ referrer, count }))[0] || { referrer: "Direct", count: 0 };

        // Prepare data for top pages chart
        const topPagesArray = Object.entries(pageCountMap)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .slice(0, 5)
          .map(([path, views]) => ({
            name: path === "/" ? "Home" : path.replace(/^\//, "").charAt(0).toUpperCase() + path.replace(/^\//, "").slice(1),
            views
          }));
        
        setTopPagesData(topPagesArray);

        // Prepare time series data
        let timeSeriesData;
        
        if (dateRange === "24hours") {
          // Group by hour for 24 hours
          timeSeriesData = Array.from(Array(24).keys()).map(hour => {
            const date = new Date(now);
            date.setHours(now.getHours() - 23 + hour);
            date.setMinutes(0, 0, 0);
            
            const hourEnd = new Date(date);
            hourEnd.setHours(date.getHours() + 1);
            
            const hourViews = pageViews.filter(pv => {
              const pvDate = new Date(pv.timestamp);
              return pvDate >= date && pvDate < hourEnd;
            }).length;
            
            return {
              name: date.getHours() + ":00",
              views: hourViews
            };
          });
        } else {
          // Group by day
          const daysCount = dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 90;
          timeSeriesData = Array.from(Array(daysCount).keys()).map(day => {
            const date = new Date(now);
            date.setDate(now.getDate() - (daysCount - 1) + day);
            date.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(date);
            dayEnd.setDate(date.getDate() + 1);
            
            const dayViews = pageViews.filter(pv => {
              const pvDate = new Date(pv.timestamp);
              return pvDate >= date && pvDate < dayEnd;
            }).length;
            
            return {
              name: `${date.getMonth() + 1}/${date.getDate()}`,
              views: dayViews
            };
          });
        }
        
        setPageViewsChart(timeSeriesData);

        setStats({
          total_views: totalViews,
          unique_users: uniqueUsers,
          top_page: topPage,
          top_referrer: topReferrer,
          avg_duration: 0
        });
      }

    } catch (error: any) {
      console.error('Error fetching traffic data:', error);
      toast({
        title: "Error",
        description: "Failed to load traffic data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold animate-slide-in-left flex items-center">
            <Activity className="h-8 w-8 mr-3" />
            Traffic Analysis
          </h1>
          
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="p-2 border rounded-md bg-background"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            <Button onClick={fetchTrafficData} disabled={loading}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.total_views.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Page views in selected period</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{animationDelay: '0.1s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.unique_users.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Unique visitors in selected period</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{animationDelay: '0.2s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Page</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-base font-bold truncate">
                    {stats.top_page.path || "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.top_page.views} views
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{animationDelay: '0.3s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Referrer</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-base font-bold truncate">
                    {stats.top_referrer.referrer || "Direct"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.top_referrer.count} referrals
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Page Views Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-80 w-full bg-muted animate-pulse rounded flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pageViewsChart} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Most Viewed Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-80 w-full bg-muted animate-pulse rounded flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topPagesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-16 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            ) : trafficData.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Traffic Data</h3>
                <p className="text-muted-foreground">
                  There is no traffic data available for the selected period.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Page</th>
                        <th className="text-left py-2 px-4">Time</th>
                        <th className="text-left py-2 px-4">User</th>
                        <th className="text-left py-2 px-4">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trafficData.slice(0, 10).map((view: any, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/50">
                          <td className="py-2 px-4 font-medium">{view.path}</td>
                          <td className="py-2 px-4 text-muted-foreground">
                            {new Date(view.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2 px-4">
                            {view.user_id ? (
                              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                Registered
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                                Guest
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-4 text-muted-foreground">
                            {view.referrer || "Direct"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {trafficData.length > 10 && (
                  <div className="flex justify-center">
                    <Button variant="outline">
                      View All ({trafficData.length}) Records
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTraffic;
