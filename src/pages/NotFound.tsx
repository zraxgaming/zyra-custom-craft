
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-md mx-auto animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="hover:scale-105 transition-transform">
              <Link to="/home">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="hover:scale-105 transition-transform">
              <Link to="/shop">
                <Search className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
            
            <Button variant="ghost" onClick={() => window.history.back()} className="hover:scale-105 transition-transform">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you believe this is an error, please contact our support team.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
