
import React, { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Bell,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useMobile();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: <Tags className="mr-2 h-4 w-4" />,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <ShoppingBag className="mr-2 h-4 w-4" />,
    },
    {
      title: "Promotions",
      href: "/admin/promotions",
      icon: <Image className="mr-2 h-4 w-4" />,
    },
    {
      title: "Contact Submissions",
      href: "/admin/contact",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <Button size="icon" variant="ghost" onClick={toggleSidebar}>
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-gray-100 w-64 flex-shrink-0 border-r transition-all duration-300 flex flex-col z-40",
          isMobile ? "fixed inset-y-0 left-0 transform" : "",
          isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b bg-white">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-zyra-purple">Zyra Admin</span>
          </Link>
        </div>

        {/* Nav links */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md w-full",
                  isActive(item.href)
                    ? "bg-zyra-purple text-white"
                    : "text-gray-700 hover:bg-gray-200"
                )}
                onClick={isMobile ? closeSidebar : undefined}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        {/* User profile */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg"
                  alt={user?.display_name || "User"}
                />
                <AvatarFallback>
                  {user?.display_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.display_name || "Admin User"}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900 ml-8 lg:ml-0">
              Admin Panel
            </h1>
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
