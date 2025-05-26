
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, TrendingUp, DollarSign, Users, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminReports = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-reports-stats"],
    queryFn: async () => {
      const [ordersResult, usersResult, productsResult] = await Promise.all([
        supabase.from("orders").select("total_amount", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact" })
      ]);

      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      return {
        totalOrders: ordersResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalRevenue
      };
    },
  });

  const reports = [
    {
      title: "Sales Report",
      description: "Comprehensive sales data and analytics",
      type: "sales",
      icon: DollarSign,
      color: "bg-green-500/10 text-green-600 border-green-500/20"
    },
    {
      title: "User Analytics",
      description: "User behavior and engagement metrics",
      type: "users",
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    {
      title: "Product Performance",
      description: "Product sales and inventory analysis",
      type: "products",
      icon: Package,
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20"
    },
    {
      title: "Monthly Summary",
      description: "Monthly business performance overview",
      type: "monthly",
      icon: Calendar,
      color: "bg-orange-500/10 text-orange-600 border-orange-500/20"
    }
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Generate and download business reports</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-border/50 shadow-lg animate-slide-in-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${stats?.totalRevenue?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalOrders || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg animate-slide-in-up" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-foreground">{stats?.totalProducts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => {
            const Icon = report.icon;
            return (
              <Card
                key={report.type}
                className={`border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-in-up ${report.color}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6" />
                    {report.title}
                  </CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      <FileText className="h-3 w-3 mr-1" />
                      PDF Report
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
