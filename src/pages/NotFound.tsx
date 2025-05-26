
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Home, Search, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background floating-dots-bg particle-field-bg">
      <Navbar />
      <Container className="py-20">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <div className="mb-8">
            <div className="text-9xl font-bold text-primary/20 mb-4 animate-bounce">
              404
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Card className="mb-8 animate-scale-in hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Go Home</h3>
                  <p className="text-sm text-muted-foreground">Return to our homepage</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Browse Products</h3>
                  <p className="text-sm text-muted-foreground">Explore our collection</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ArrowLeft className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Go Back</h3>
                  <p className="text-sm text-muted-foreground">Return to previous page</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="animate-slide-in-left">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="animate-slide-in-right">
              <Link to="/shop">
                <Search className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default NotFound;
