
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, Search, Sparkles, Star, Package } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full animate-pulse blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full animate-pulse delay-1000 blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent/5 rounded-full animate-float blur-2xl"></div>
          
          {/* Floating elements */}
          <div className="absolute top-20 left-20 animate-bounce delay-300">
            <Star className="h-6 w-6 text-primary/30" />
          </div>
          <div className="absolute top-32 right-32 animate-bounce delay-700">
            <Package className="h-8 w-8 text-secondary/30" />
          </div>
          <div className="absolute bottom-32 left-32 animate-bounce delay-500">
            <Sparkles className="h-7 w-7 text-accent/40" />
          </div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl animate-scale-in">
              <CardContent className="p-12 space-y-8">
                {/* 404 Number with gradient */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  <h1 className="relative text-8xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
                    404
                  </h1>
                </div>

                {/* Badge */}
                <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 text-white animate-scale-in px-4 py-2">
                  <Search className="h-4 w-4 mr-2" />
                  Page Not Found
                </Badge>

                {/* Main message */}
                <div className="space-y-4 animate-fade-in delay-300">
                  <h2 className="text-3xl font-bold text-foreground">
                    Oops! Page Not Found
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    The page you're looking for seems to have wandered off into the digital wilderness. 
                    Let's get you back on track!
                  </p>
                </div>

                {/* Suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 animate-slide-in-right delay-500">
                  <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground bg-muted/30 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Check the URL</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground bg-muted/30 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Use the search</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground bg-muted/30 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Browse categories</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in delay-700">
                  <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    className="hover:scale-105 transition-all duration-300 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                  <Button
                    onClick={() => navigate("/shop")}
                    variant="secondary"
                    className="hover:scale-105 transition-all duration-300 bg-secondary/20 hover:bg-secondary/30 backdrop-blur-sm"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Browse Shop
                  </Button>
                </div>

                {/* Fun message */}
                <div className="pt-6 border-t border-border/50 animate-fade-in delay-1000">
                  <p className="text-sm text-muted-foreground italic">
                    "Not all who wander are lost, but this page definitely is!" 🗺️
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
