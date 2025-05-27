
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartProvider";
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Home, 
  Store, 
  Gift,
  Heart,
  Phone,
  Info,
  LogOut,
  Settings,
  Package
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import CartDrawer from "@/components/cart/CartDrawer";

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-purple-200/30 dark:border-purple-800/30 sticky top-0 z-50 animate-slide-down shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-3 hover-scale animate-slide-in-left">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg animate-float">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Zyra
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 animate-slide-in-up">
              <Link 
                to="/home" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover-scale story-link font-medium"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link 
                to="/shop" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover-scale story-link font-medium"
              >
                <Store className="h-4 w-4" />
                Shop
              </Link>
              <Link 
                to="/categories" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover-scale story-link font-medium"
              >
                <Package className="h-4 w-4" />
                Categories
              </Link>
              <Link 
                to="/gift-cards" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover-scale story-link font-medium"
              >
                <Gift className="h-4 w-4" />
                Gift Cards
              </Link>
              <Link 
                to="/about" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover-scale story-link font-medium"
              >
                <Info className="h-4 w-4" />
                About
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover-scale story-link font-medium"
              >
                <Phone className="h-4 w-4" />
                Contact
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 animate-slide-in-right">
              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative hover-scale"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-bounce">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  {user && (
                    <Link 
                      to="/wishlist" 
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover-scale"
                    >
                      <Heart className="h-4 w-4" />
                    </Link>
                  )}
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover-scale"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover-scale"
                    >
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button className="btn-premium">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    <Link 
                      to="/home" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium hover:text-purple-600 transition-colors"
                    >
                      <Home className="h-5 w-5" />
                      Home
                    </Link>
                    <Link 
                      to="/shop" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium hover:text-purple-600 transition-colors"
                    >
                      <Store className="h-5 w-5" />
                      Shop
                    </Link>
                    <Link 
                      to="/categories" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium hover:text-purple-600 transition-colors"
                    >
                      <Package className="h-5 w-5" />
                      Categories
                    </Link>
                    <Link 
                      to="/gift-cards" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium hover:text-purple-600 transition-colors"
                    >
                      <Gift className="h-5 w-5" />
                      Gift Cards
                    </Link>
                    <Link 
                      to="/about" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium hover:text-purple-600 transition-colors"
                    >
                      <Info className="h-5 w-5" />
                      About
                    </Link>
                    <Link 
                      to="/contact" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium hover:text-purple-600 transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      Contact
                    </Link>
                    
                    {user ? (
                      <>
                        <div className="border-t pt-4 space-y-4">
                          <Link 
                            to="/dashboard" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-lg font-medium hover:text-purple-600 transition-colors"
                          >
                            <User className="h-5 w-5" />
                            Dashboard
                          </Link>
                          <Link 
                            to="/wishlist" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-lg font-medium hover:text-purple-600 transition-colors"
                          >
                            <Heart className="h-5 w-5" />
                            Wishlist
                          </Link>
                          {isAdmin && (
                            <Link 
                              to="/admin" 
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 text-lg font-medium hover:text-purple-600 transition-colors"
                            >
                              <Settings className="h-5 w-5" />
                              Admin Panel
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => {
                              handleSignOut();
                              setIsOpen(false);
                            }}
                            className="justify-start p-0 h-auto text-red-600 hover:text-red-700 text-lg font-medium"
                          >
                            <LogOut className="h-5 w-5 mr-3" />
                            Sign Out
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="border-t pt-4">
                        <Link to="/auth" onClick={() => setIsOpen(false)}>
                          <Button className="w-full btn-premium">
                            <User className="h-4 w-4 mr-2" />
                            Sign In
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default Navbar;
