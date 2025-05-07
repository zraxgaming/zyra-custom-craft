
import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Tag,
  List,
  MessageSquare,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Products", href: "/admin/products", icon: <Package className="h-5 w-5" /> },
  { name: "Categories", href: "/admin/categories", icon: <List className="h-5 w-5" /> },
  { name: "Orders", href: "/admin/orders", icon: <ShoppingCart className="h-5 w-5" /> },
  { name: "Coupons", href: "/admin/coupons", icon: <Tag className="h-5 w-5" /> },
  { name: "Promotions", href: "/admin/promotions", icon: <Tag className="h-5 w-5" /> },
  { name: "Contact", href: "/admin/contact", icon: <MessageSquare className="h-5 w-5" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  
  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  
  // Create user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.user_metadata?.name || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  // Get shortened display name
  const getDisplayName = () => {
    if (!user) return "User";
    return user.user_metadata?.name || user.email || "User";
  };
  
  // Mobile Navigation
  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <List className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col h-full py-4">
          <div className="px-4 py-2">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? "bg-zyra-purple text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-2 mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-10 border-r bg-white">
        <div className="flex-1 flex flex-col min-h-0 pt-5">
          <div className="px-4 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-lg font-semibold">Zyra Admin</span>
            </Link>
          </div>
          <nav className="mt-8 flex-1 px-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? "bg-zyra-purple text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Avatar>
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{getDisplayName()}</p>
              <Button
                variant="ghost"
                className="text-xs text-red-600 hover:text-red-700 px-0 py-0"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden bg-white border-b">
          <div className="flex justify-between items-center px-4 h-14">
            <MobileNav />
            <Link to="/" className="text-lg font-semibold">
              Zyra Admin
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{getDisplayName()}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
