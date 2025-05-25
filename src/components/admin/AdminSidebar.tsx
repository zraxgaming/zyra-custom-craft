
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
  Gift
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
    { name: "Barcodes", href: "/admin/barcodes", icon: QrCode },
    { name: "Scanner", href: "/admin/scanner", icon: ScanLine },
    { name: "Contact", href: "/admin/contact", icon: MessageSquare },
    { name: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
      </div>
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Link to={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
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
