import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, Search, Sparkles, Crown, LogOut, Settings, Home, Package, Gift, Users as UsersIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import SearchBar from "@/components/search/SearchBar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { toggleCart, totalItems } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navigation = [
    { name: "Home", href: "/home" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "Gift Cards", href: "/gift-cards" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/home" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Zyra
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium hover:scale-105 transform"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <Link to="/wishlist">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                className="relative hover:scale-110 transition-transform duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-transform duration-200">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.first_name || "User"} />
                        <AvatarFallback>
                          {user.user_metadata?.first_name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 animate-slide-in-right" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user.user_metadata?.first_name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/gift-cards" className="cursor-pointer">
                        <Gift className="mr-2 h-4 w-4" />
                        Gift Cards
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="hover:scale-105 transition-transform duration-200">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                className="relative hover:scale-110 transition-transform duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="hover:scale-110 transition-transform duration-200"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-slide-in-right">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                {user ? (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.first_name || "User"} />
                        <AvatarFallback>
                          {user.user_metadata?.first_name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {user.user_metadata?.first_name || "User"}
                      </span>
                    </div>
                    <Button asChild variant="ghost" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                      <Link to="/account" onClick={() => setIsOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        My Account
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                      <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                      <Link to="/gift-cards" onClick={() => setIsOpen(false)}>
                        <Gift className="mr-2 h-4 w-4" />
                        Gift Cards
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Button asChild variant="ghost" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                          <Package className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start hover:scale-105 transition-transform duration-200">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full hover:scale-105 transition-transform duration-200">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <CartDrawer />
    </>
  );
};

export default Navbar;
