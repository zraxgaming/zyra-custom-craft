
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon,
  LogOut,
  Settings,
  Package,
  Gift,
  Star,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { items, itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gradient' 
        : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group transition-all duration-500 hover-3d-lift"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 animate-float">
              <Sparkles className="h-7 w-7 text-white animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-shimmer">
              Zyra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link 
              to="/shop" 
              className={`font-semibold text-lg transition-all duration-500 hover:text-primary relative group hover-magnetic ${
                isActive('/shop') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Shop
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-primary to-purple-600 transition-all duration-500 group-hover:w-full rounded-full"></span>
            </Link>
            <Link 
              to="/about" 
              className={`font-semibold text-lg transition-all duration-500 hover:text-primary relative group hover-magnetic ${
                isActive('/about') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              About
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-primary to-purple-600 transition-all duration-500 group-hover:w-full rounded-full"></span>
            </Link>
            <Link 
              to="/contact" 
              className={`font-semibold text-lg transition-all duration-500 hover:text-primary relative group hover-magnetic ${
                isActive('/contact') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Contact
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-primary to-purple-600 transition-all duration-500 group-hover:w-full rounded-full"></span>
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-3 flex-1 max-w-lg mx-10">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-background/60 border-2 border-border/50 focus:border-primary/70 focus:bg-background transition-all duration-500 hover:bg-background/80 rounded-2xl text-lg hover-magnetic"
              />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-12 w-12 hover:bg-primary/10 hover:text-primary transition-all duration-500 hover-3d-lift rounded-xl"
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-12 w-12 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 transition-all duration-500 hover-3d-lift rounded-xl"
              >
                <Heart className="h-6 w-6" />
                <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 animate-pulse rounded-full">
                  0
                </Badge>
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-12 w-12 hover:bg-primary/10 hover:text-primary transition-all duration-500 hover-3d-lift rounded-xl"
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs bg-gradient-to-r from-primary to-purple-600 animate-bounce rounded-full">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 hover:bg-primary/10 hover:text-primary transition-all duration-500 hover-3d-lift rounded-xl"
                  >
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-background/95 backdrop-blur-xl border-2 border-border/50 rounded-2xl shadow-2xl">
                  <div className="p-4">
                    <p className="text-lg font-semibold">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {isAdmin ? 'Administrator' : 'Customer'}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center cursor-pointer p-3 text-base">
                      <User className="mr-3 h-5 w-5" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center cursor-pointer p-3 text-base">
                      <Package className="mr-3 h-5 w-5" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center cursor-pointer p-3 text-base">
                      <Heart className="mr-3 h-5 w-5" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/referrals" className="flex items-center cursor-pointer p-3 text-base">
                      <Gift className="mr-3 h-5 w-5" />
                      Referrals
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center cursor-pointer p-3 text-base text-primary">
                          <Settings className="mr-3 h-5 w-5" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 dark:text-red-400 p-3 text-base">
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-500 hover-3d-lift hover:shadow-2xl rounded-2xl px-8 text-lg font-semibold">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-12 w-12 rounded-xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b-2 border-border/50 animate-slide-in-down shadow-2xl">
            <div className="p-6 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 rounded-2xl"
                  />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                <Link
                  to="/shop"
                  className="block px-4 py-3 rounded-2xl text-lg font-semibold hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-3 rounded-2xl text-lg font-semibold hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-3 rounded-2xl text-lg font-semibold hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
