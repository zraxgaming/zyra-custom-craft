
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Home, Search, ShoppingBag } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-zyra-soft-gray py-20">
        <div className="text-center max-w-md px-4">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 rounded-full bg-zyra-purple/10 flex items-center justify-center">
              <span className="text-6xl font-bold text-zyra-purple">404</span>
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Page not found
          </h1>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable. Sorry for the inconvenience.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4" /> Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              asChild
            >
              <Link to="/shop">
                <Search className="h-4 w-4" /> Browse
              </Link>
            </Button>
            <Button 
              className="bg-zyra-purple hover:bg-zyra-dark-purple flex items-center gap-2"
              asChild
            >
              <Link to="/shop">
                <ShoppingBag className="h-4 w-4" /> Shop
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
