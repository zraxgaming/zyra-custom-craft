
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Get user avatar URL and initial safely
  const getUserAvatar = () => {
    if (!user) return "";
    return localStorage.getItem('user_picture') || "";
  };

  const getUserInitial = () => {
    if (!user) return "U";
    const name = localStorage.getItem('user_name') || "";
    const email = localStorage.getItem('user_email') || "";
    
    if (name) {
      return name.charAt(0).toUpperCase();
    } else if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {isMobile && (
              <button onClick={toggleMenu} className="mr-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-zyra-purple">ZYRA</span>
            </Link>
            
            {!isMobile && (
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:text-zyra-purple">
                    Home
                  </Link>
                  <Link
                    to="/shop"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:text-zyra-purple"
                  >
                    Shop
                  </Link>
                  <Link
                    to="/categories"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:text-zyra-purple"
                  >
                    Categories
                  </Link>
                  <Link
                    to="/about"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:text-zyra-purple"
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:text-zyra-purple"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center justify-end md:flex-1">
            <div className="relative rounded-md shadow-sm mr-4 w-64">
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 py-2"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getUserAvatar()} />
                      <AvatarFallback>
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                <User className="h-6 w-6 text-gray-500" />
              </Link>
            )}
            
            <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 relative">
              <ShoppingBag className="h-6 w-6 text-gray-500" />
              <span className="absolute top-0 right-0 bg-zyra-purple text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>
          </div>
          
          {isMobile && (
            <div className="flex items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getUserAvatar()} />
                        <AvatarFallback>
                          {getUserInitial()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                  <User className="h-6 w-6 text-gray-500" />
                </Link>
              )}
              <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 relative">
                <ShoppingBag className="h-6 w-6 text-gray-500" />
                <span className="absolute top-0 right-0 bg-zyra-purple text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  0
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Shop
            </Link>
            <Link
              to="/categories"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            {user && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  My Account
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                    onClick={toggleMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="p-4 border-t">
            <div className="relative rounded-md shadow-sm">
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 py-2 w-full"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
