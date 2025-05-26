
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp, 
  BarChart3,
  Plus,
  Settings
} from "lucide-react";
import RealTimeStats from "./RealTimeStats";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const quickActions = [
    {
      title: "Add Product",
      description: "Create a new product listing",
      icon: Plus,
      href: "/admin/products/new",
      color: "bg-blue-500"
    },
    {
      title: "View Orders",
      description: "Manage customer orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-green-500"
    },
    {
      title: "Manage Users",
      description: "View and manage customers",
      icon: Users,
      href: "/admin/customers",
      color: "bg-purple-500"
    },
    {
      title: "Analytics",
      description: "View detailed analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-orange-500"
    },
    {
      title: "Products",
      description: "Manage product catalog",
      icon: Package,
      href: "/admin/products",
      color: "bg-pink-500"
    },
    {
      title: "Settings",
      description: "Configure store settings",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold animate-slide-in-left">Admin Dashboard</h1>
          <p className="text-muted-foreground animate-slide-in-left" style={{animationDelay: '0.1s'}}>
            Manage your store and track performance
          </p>
        </div>
        <div className="flex gap-2 animate-slide-in-right">
          <Button asChild>
            <Link to="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <RealTimeStats />

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Card 
            key={action.title} 
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-scale-in group cursor-pointer"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <Link to={action.href}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  {action.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-fade-in">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Product updated</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New customer registered</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-pulse">
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Product running low
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-300">
                    Only 3 items left
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Restock
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
