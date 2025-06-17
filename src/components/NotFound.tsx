
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center animate-fade-in">
        <CardContent className="p-8">
          <div className="mb-8">
            <div className="text-8xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-bounce">
              404
            </div>
            <h1 className="text-2xl font-bold mt-4 mb-2 animate-slide-in-up">
              Page Not Found
            </h1>
            <p className="text-muted-foreground animate-slide-in-up" style={{animationDelay: '0.1s'}}>
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild className="w-full animate-scale-in" style={{animationDelay: '0.2s'}}>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full animate-scale-in" style={{animationDelay: '0.3s'}}>
              <Link to="/shop">
                <Search className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="w-full animate-scale-in"
              style={{animationDelay: '0.4s'}}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
