
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
  QrCode,
  ScanLine,
  Mail,
  Gift,
  Users,
  AlertTriangle
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Products", href: "/admin/products", icon: Package },
    { title: "Categories", href: "/admin/categories", icon: FolderOpen },
    { title: "Inventory", href: "/admin/inventory", icon: BarChart3 },
    { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Reviews", href: "/admin/reviews", icon: Star },
    { title: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
    { title: "Barcodes", href: "/admin/barcodes", icon: QrCode },
    { title: "Scanner", href: "/admin/scanner", icon: ScanLine },
    { title: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { title: "Ziina", href: "/admin/ziina", icon: AlertTriangle },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-card/80 backdrop-blur-sm border-r border-border/50 h-screen overflow-y-auto">
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              location.pathname === item.href
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50 hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
              location.pathname === item.href ? "text-white" : ""
            )} />
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
