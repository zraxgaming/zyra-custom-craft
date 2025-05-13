
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/components/cart/CartProvider";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggleSimple } from "@/components/theme/ThemeToggle";

const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const { items, openCart } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);


  const itemCount = items?.length || 0;
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("name, slug")
          .order("name");

        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
          : "bg-white dark:bg-gray-900"
      } transition-all duration-200`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-zyra-purple">Zyra</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-zyra-purple ${
                location.pathname === "/"
                  ? "text-zyra-purple"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-sm font-medium transition-colors hover:text-zyra-purple ${
                location.pathname === "/shop"
                  ? "text-zyra-purple"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Shop
            </Link>
            <Link
              to="/categories"
              className={`text-sm font-medium transition-colors hover:text-zyra-purple ${
                location.pathname === "/categories"
                  ? "text-zyra-purple"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-zyra-purple ${
                location.pathname === "/about"
                  ? "text-zyra-purple"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors hover:text-zyra-purple ${
                location.pathname === "/contact"
                  ? "text-zyra-purple"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[180px] lg:w-[260px] pl-9 rounded-full bg-gray-100 dark:bg-gray-800 border-none focus-visible:ring-zyra-purple"
              />
            </div>
            
            <ThemeToggleSimple />

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-zyra-purple text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Button>

            {user ? (
              <Link to={isAdmin ? "/admin" : "/profile"}>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="relative mr-2"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-zyra-purple text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Button>

            <ThemeToggleSimple />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold">Menu</h2>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-9 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                    <nav className="flex flex-col space-y-4">
                      <Link
                        to="/"
                        className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Home
                      </Link>
                      <Link
                        to="/shop"
                        className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Shop All
                      </Link>
                      <div>
                        <h3 className="font-medium mb-2 text-gray-500 dark:text-gray-400">Categories</h3>
                        <div className="flex flex-col space-y-1 ml-2">
                          {categories.map((category) => (
                            <Link
                              key={category.slug}
                              to={`/shop?category=${category.slug}`}
                              className="text-sm px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <Link
                        to="/about"
                        className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        About
                      </Link>
                      <Link
                        to="/contact"
                        className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Contact
                      </Link>
                    </nav>
                  </div>
                  <div className="p-4 border-t">
                    {user ? (
                      <div className="flex flex-col space-y-2">
                        <Link to="/profile">
                          <Button variant="outline" className="w-full">
                            My Account
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Link to="/admin">
                            <Button variant="outline" className="w-full">
                              Admin Dashboard
                            </Button>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <Link to="/auth">
                        <Button className="w-full bg-zyra-purple hover:bg-zyra-dark-purple">
                          Login / Register
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
