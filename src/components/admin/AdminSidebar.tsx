import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Gift,
  Percent,
  Settings,
  Tags,
  PackageCheck,
  Mail,
  TrendingUp,
  QrCode,
  Scan,
  MessageSquare,
  CreditCard,
  Home
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/admin" },
  { icon: Tags, label: "Categories", path: "/admin/categories" },
  { icon: PackageCheck, label: "Inventory", path: "/admin/inventory" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Gift, label: "Gift Cards", path: "/admin/gift-cards" },
  { icon: Percent, label: "Coupons", path: "/admin/coupons" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Mail, label: "Newsletter", path: "/admin/newsletter" },
  { icon: TrendingUp, label: "Traffic", path: "/admin/traffic" },
  { icon: QrCode, label: "Barcodes", path: "/admin/barcodes" },
  { icon: Scan, label: "Scanner", path: "/admin/scanner" },
  { icon: MessageSquare, label: "Contact", path: "/admin/contact" },
  { icon: CreditCard, label: "Ziina", path: "/admin/ziina" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg"></div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Zyra Admin
          </span>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
