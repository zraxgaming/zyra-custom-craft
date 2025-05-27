
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Star,
  BarChart3,
  Settings,
  Users,
  Mail,
  QrCode,
  Smartphone,
  ScanLine,
  Gift
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Products", href: "/admin/products", icon: Package },
    { title: "Categories", href: "/admin/categories", icon: FolderOpen },
    { title: "Inventory", href: "/admin/inventory", icon: BarChart3 },
    { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { title: "Reviews", href: "/admin/reviews", icon: Star },
    { title: "Barcodes", href: "/admin/barcodes", icon: QrCode },
    { title: "Scanner", href: "/admin/scanner", icon: ScanLine },
    { title: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { title: "Payments", href: "/admin/ziina", icon: Smartphone },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen overflow-y-auto glass-sidebar">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover-magnetic animate-slide-in-left",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground shadow-lg border-gradient"
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover-3d-lift"
            )}
            style={{animationDelay: `${index * 50}ms`}}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
