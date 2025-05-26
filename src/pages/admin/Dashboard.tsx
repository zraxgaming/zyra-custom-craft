
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RealTimeStats from "@/components/admin/analytics/RealTimeStats";
import RealTimeAnalytics from "@/components/admin/RealTimeAnalytics";
import RecentOrders from "@/components/admin/RecentOrders";
import ProductClicksAnalysis from "@/components/admin/ProductClicksAnalysis";
import TrafficAnalysis from "@/components/admin/TrafficAnalysis";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Sparkles } from "lucide-react";

const AdminDashboard = () => {
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
                <BarChart3 className="h-5 w-5 mr-3" />
                Admin Control Center
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
              Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
              Monitor your store performance and manage operations from one central location.
            </p>
          </div>

          {/* Real-time Statistics */}
          <div className="mb-8 animate-slide-in-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Real-time Statistics</h2>
            </div>
            <RealTimeStats />
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="hover:shadow-2xl transition-all duration-500 animate-slide-in-left bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Analytics Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <RealTimeAnalytics />
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-500 animate-slide-in-right bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Traffic Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <TrafficAnalysis />
              </CardContent>
            </Card>
          </div>

          {/* Product Analytics */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <ProductClicksAnalysis />
          </div>

          {/* Recent Orders */}
          <div className="animate-slide-in-right" style={{ animationDelay: '500ms' }}>
            <RecentOrders />
          </div>

          {/* Performance Indicators */}
          <Card className="mt-8 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30 hover:shadow-2xl transition-all duration-500 animate-bounce-in backdrop-blur-sm">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 animate-pulse"></div>
              <div className="relative">
                <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Store Performance
                </h3>
                <p className="text-muted-foreground mb-8 text-xl max-w-2xl mx-auto">
                  Your store is performing excellently! Keep up the great work managing your products and customer experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                    <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">2.4s</div>
                    <div className="text-sm text-muted-foreground">Avg. Page Load</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
