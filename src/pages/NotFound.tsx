
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Home, Search, ArrowLeft, Sparkles } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const NotFound = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "Shop Products", path: "/shop", icon: <Search className="h-4 w-4" /> },
    { label: "Featured Items", path: "/", icon: <Sparkles className="h-4 w-4" /> },
    { label: "Contact Us", path: "/contact", icon: <Home className="h-4 w-4" /> }
  ];

  return (
    <>
      <SEOHead 
        title="Page Not Found - Zyra"
        description="The page you're looking for doesn't exist. Return to Zyra's homepage to continue shopping for custom products."
        noIndex={true}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* 404 Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"></div>
          <Container className="relative z-10">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce">
                    404
                  </div>
                </div>
              </div>
              
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 animate-scale-in">
                Page Not Found
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground animate-slide-in-right">
                Oops! This page got lost in customization
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 animate-slide-in-left">
                The page you're looking for doesn't exist. It might have been moved, deleted, 
                or you entered the wrong URL. Let's get you back to creating amazing custom products!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                
                <Button 
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Button>
              </div>

              {/* Quick Links */}
              <div className="space-y-4 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quick Links to Get You Started
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {quickLinks.map((link, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => navigate(link.path)}
                      className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      {link.icon}
                      <span className="ml-2">{link.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Suggestion Section */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  While you're here...
                </h2>
                <p className="text-muted-foreground mb-6">
                  Why not check out our latest custom products? From personalized phone cases 
                  to custom apparel, we have something for everyone.
                </p>
                <Button 
                  onClick={() => navigate("/shop")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-600/90 hover:to-pink-600/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Explore Products
                </Button>
              </div>
            </div>
          </Container>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default NotFound;
