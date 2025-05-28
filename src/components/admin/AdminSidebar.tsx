
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3,
  Tags,
  Gift,
  Scan,
  MessageSquare,
  Bell,
  CreditCard,
  Palette,
  FileText,
  Shield,
  Database,
  Wrench
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Analytics",
          href: "/admin/analytics",
          icon: BarChart3,
        },
      ]
    },
    {
      title: "Products & Inventory",
      items: [
        {
          title: "Products",
          href: "/admin/products",
          icon: Package,
        },
        {
          title: "Categories",
          href: "/admin/categories",
          icon: Tags,
        },
        {
          title: "Inventory",
          href: "/admin/inventory",
          icon: Database,
        },
        {
          title: "Scanner",
          href: "/admin/scanner",
          icon: Scan,
        },
      ]
    },
    {
      title: "Orders & Sales",
      items: [
        {
          title: "Orders",
          href: "/admin/orders",
          icon: ShoppingCart,
        },
        {
          title: "Gift Cards",
          href: "/admin/gift-cards",
          icon: Gift,
        },
      ]
    },
    {
      title: "Customers",
      items: [
        {
          title: "Users",
          href: "/admin/users",
          icon: Users,
        },
        {
          title: "Reviews",
          href: "/admin/reviews",
          icon: MessageSquare,
        },
      ]
    },
    {
      title: "Payment & Finance",
      items: [
        {
          title: "Ziina Integration",
          href: "/admin/ziina",
          icon: CreditCard,
        },
      ]
    },
    {
      title: "Content & Design",
      items: [
        {
          title: "Banners",
          href: "/admin/banners",
          icon: Palette,
        },
        {
          title: "Pages",
          href: "/admin/pages",
          icon: FileText,
        },
        {
          title: "Notifications",
          href: "/admin/notifications",
          icon: Bell,
        },
      ]
    },
    {
      title: "System",
      items: [
        {
          title: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
        {
          title: "Security",
          href: "/admin/security",
          icon: Shield,
        },
        {
          title: "Maintenance",
          href: "/admin/maintenance",
          icon: Wrench,
        },
      ]
    }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen overflow-hidden animate-slide-in-right">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={section.title} className="animate-fade-in" style={{animationDelay: `${sectionIndex * 100}ms`}}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-10 px-3 font-medium transition-all duration-300 animate-slide-in-right hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/20 dark:hover:to-pink-950/20",
                        isActive && "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 shadow-sm"
                      )}
                      style={{animationDelay: `${(sectionIndex * 100) + (itemIndex * 50)}ms`}}
                    >
                      <Link to={item.href} className="flex items-center gap-3 w-full">
                        <item.icon className={cn(
                          "h-4 w-4 transition-colors",
                          isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"
                        )} />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminSidebar;
