
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <Link to="/account" className="p-2 rounded-full hover:bg-gray-100 mr-2">
              <User className="h-6 w-6 text-gray-500" />
            </Link>
            <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 relative">
              <ShoppingBag className="h-6 w-6 text-gray-500" />
              <span className="absolute top-0 right-0 bg-zyra-purple text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>
          </div>
          
          {isMobile && (
            <div className="flex items-center">
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
            <Link
              to="/account"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
              onClick={toggleMenu}
            >
              My Account
            </Link>
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
