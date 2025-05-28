
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Container className="py-20">
        <div className="max-w-lg mx-auto text-center space-y-8">
          <div className="space-y-6">
            <div className="relative mx-auto w-40 h-40">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-25"></div>
              <div className="relative flex items-center justify-center w-40 h-40 rounded-full bg-primary/10">
                <p className="text-8xl font-bold text-primary">404</p>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold">Page Not Found</h1>
            
            <p className="text-lg text-muted-foreground">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/home')}
              className="flex items-center"
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
          
          <div className="pt-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input 
                type="search"
                placeholder="Search for products..."
                className="pl-10 w-full py-3 px-4 bg-background border rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/shop?search=${encodeURIComponent(e.currentTarget.value)}`);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default NotFound;
