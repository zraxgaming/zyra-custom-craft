
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
  Percent
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { name: "Promotions", href: "/admin/promotions", icon: Tags },
    { name: "Coupons", href: "/admin/coupons", icon: Percent },
    { name: "Barcodes", href: "/admin/barcodes", icon: QrCode },
    { name: "Scanner", href: "/admin/scanner", icon: ScanLine },
    { name: "Contact", href: "/admin/contact", icon: MessageSquare },
    { name: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
    { name: "Ziina Stats", href: "/admin/ziina-stats", icon: CreditCard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-full animate-slide-in-right">
      <div className="p-6">
        <h2 className="text-xl font-bold text-foreground animate-fade-in">Admin Panel</h2>
      </div>
      <nav className="px-4 space-y-2">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start transition-all duration-300 hover:scale-105 animate-fade-in",
                isActive && "bg-primary text-primary-foreground shadow-lg"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Link to={item.href}>
                <item.icon className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
