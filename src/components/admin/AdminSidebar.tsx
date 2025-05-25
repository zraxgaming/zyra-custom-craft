
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Mail,
  BarChart3,
  Settings,
  Tags,
  QrCode,
  ScanLine,
  MessageSquare,
  Gift,
  CreditCard,
  Percent,
  Grid3X3,
  PackageOpen,
  TrendingUp,
  DollarSign
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Grid3X3 },
    { name: "Inventory", href: "/admin/inventory", icon: PackageOpen },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { name: "Promotions", href: "/admin/promotions", icon: Tags },
    { name: "Coupons", href: "/admin/coupons", icon: Percent },
    { name: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
    { name: "Barcodes", href: "/admin/barcodes", icon: QrCode },
    { name: "Scanner", href: "/admin/scanner", icon: ScanLine },
    { name: "Contact", href: "/admin/contact", icon: MessageSquare },
    { name: "Page Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Ziina Payment", href: "/admin/ziina", icon: DollarSign },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-card to-card/80 border-r border-border/50 h-full animate-slide-in-left backdrop-blur-sm">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-full blur"></div>
            <div className="relative bg-primary p-2 rounded-full">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground animate-fade-in">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Zyra Management</p>
          </div>
        </div>
      </div>
      
      <nav className="px-4 py-6 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start transition-all duration-300 hover:scale-105 animate-fade-in group relative",
                isActive && "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Link to={item.href} className="flex items-center gap-3">
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-primary-foreground/20" 
                    : "bg-transparent group-hover:bg-primary/10"
                )}>
                  <item.icon className={cn(
                    "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )} />
                </div>
                <span className={cn(
                  "font-medium transition-colors duration-200",
                  isActive ? "text-primary-foreground" : "text-foreground group-hover:text-primary"
                )}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
                )}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border/50 mt-auto">
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
          <p className="text-xs font-medium text-foreground">Zyra Admin v1.0</p>
          <p className="text-xs text-muted-foreground">Premium E-commerce</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
