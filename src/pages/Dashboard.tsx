
import React from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Settings, 
  Package, 
  CreditCard,
  Gift,
  TrendingUp,
  Clock,
  Star
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const dashboardStats = [
    {
      title: "Total Orders",
      value: "12",
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      change: "+2 this month"
    },
    {
      title: "Wishlist Items",
      value: "8",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      change: "+3 recently"
    },
    {
      title: "Loyalty Points",
      value: "1,250",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      change: "+50 this week"
    },
    {
      title: "Total Spent",
      value: "$2,480",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      change: "+$320 this month"
    }
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      status: "delivered",
      total: "$89.99",
      date: "2024-01-15",
      items: 2
    },
    {
      id: "ORD-002",
      status: "shipped",
      total: "$156.50",
      date: "2024-01-12",
      items: 3
    },
    {
      id: "ORD-003",
      status: "processing",
      total: "$75.25",
      date: "2024-01-10",
      items: 1
    }
  ];

  const quickActions = [
    {
      title: "Browse Products",
      description: "Discover new items",
      icon: ShoppingBag,
      href: "/shop",
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "View Wishlist",
      description: "Check saved items",
      icon: Heart,
      href: "/wishlist",
      color: "bg-gradient-to-br from-pink-500 to-pink-600"
    },
    {
      title: "Gift Cards",
      description: "Send to friends",
      icon: Gift,
      href: "/gift-cards",
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      title: "Account Settings",
      description: "Update profile",
      icon: Settings,
      href: "/account/settings",
      color: "bg-gradient-to-br from-gray-500 to-gray-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <>
      <SEOHead 
        title="Dashboard - Zyra"
        description="Manage your orders, wishlist, and account settings. Track your purchases and discover new products."
        url="https://zyra.lovable.app/dashboard"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome back!
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card 
              key={stat.title}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="animate-scale-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link 
                  key={action.title}
                  to={action.href}
                  className="group"
                >
                  <div className={`${action.color} text-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in`}
                       style={{ animationDelay: `${(index + 5) * 100}ms` }}>
                    <action.icon className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="animate-scale-in" style={{ animationDelay: '500ms' }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/account/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:shadow-md transition-all duration-300 hover:border-primary/50 animate-fade-in"
                    style={{ animationDelay: `${(index + 10) * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items} items • {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{order.total}</p>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="animate-scale-in" style={{ animationDelay: '600ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: '700ms' }}>
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order delivered</p>
                    <p className="text-xs text-muted-foreground">Order #ORD-001 was delivered successfully</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: '800ms' }}>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Heart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Added to wishlist</p>
                    <p className="text-xs text-muted-foreground">Premium Wireless Headphones</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: '900ms' }}>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Earned loyalty points</p>
                    <p className="text-xs text-muted-foreground">+50 points from recent purchase</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="animate-scale-in" style={{ animationDelay: '700ms' }}>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="p-6 bg-muted/30 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Personalized recommendations coming soon!</h3>
              <p className="text-muted-foreground mb-6">
                We're analyzing your preferences to suggest products you'll love.
              </p>
              <Button asChild>
                <Link to="/shop">Explore Products</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
      
      <Footer />
    </>
  );
};

export default Dashboard;
