
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 dark:from-primary/20 dark:via-purple-500/10 dark:to-pink-500/20 text-foreground overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-bounce-in">
                <Sparkles className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium text-primary">Premium Custom Products</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight animate-scale-in">
                Your Design, <br />
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse-glow">
                  Your Style
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-md leading-relaxed animate-slide-in-right">
              Create custom products that truly reflect your personality.
              Easy to design, high-quality results, fast delivery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground font-medium px-8 py-6 rounded-lg text-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
                <Link to="/shop">
                  Shop Now
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-primary/20 hover:border-primary hover:bg-primary/10 font-medium px-8 py-6 rounded-lg text-lg hover:scale-105 transition-all duration-300">
                <Link to="/categories" className="flex items-center gap-2">
                  Browse Categories <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="text-center hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Product Types</div>
              </div>
              <div className="text-center hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          {/* Product Showcase */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl transform rotate-6"></div>
            <div className="relative grid grid-cols-2 gap-6 p-6">
              <div className="space-y-6">
                <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 transform hover:rotate-2 hover:scale-105 transition-all duration-500 animate-slide-in-right">
                  <img 
                    src="https://images.unsplash.com/photo-1607581072646-80a005fd7614?w=500&auto=format&fit=crop&q=60" 
                    alt="Custom Phone Case" 
                    className="rounded-xl w-full object-cover h-48 hover:scale-110 transition-transform duration-300"
                  />
                  <div className="mt-3">
                    <h3 className="font-semibold text-foreground">Custom Phone Cases</h3>
                    <p className="text-sm text-muted-foreground">From $24.99</p>
                  </div>
                </div>
                <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 transform hover:-rotate-2 hover:scale-105 transition-all duration-500 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60" 
                    alt="Custom T-shirt" 
                    className="rounded-xl w-full object-cover h-48 hover:scale-110 transition-transform duration-300"
                  />
                  <div className="mt-3">
                    <h3 className="font-semibold text-foreground">Custom Apparel</h3>
                    <p className="text-sm text-muted-foreground">From $19.99</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 transform hover:rotate-2 hover:scale-105 transition-all duration-500 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1607038233846-064b5142c885?w=500&auto=format&fit=crop&q=60" 
                    alt="Custom Hoodie" 
                    className="rounded-xl w-full object-cover h-48 hover:scale-110 transition-transform duration-300"
                  />
                  <div className="mt-3">
                    <h3 className="font-semibold text-foreground">Custom Hoodies</h3>
                    <p className="text-sm text-muted-foreground">From $39.99</p>
                  </div>
                </div>
                <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 transform hover:-rotate-2 hover:scale-105 transition-all duration-500 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60" 
                    alt="Custom Mug" 
                    className="rounded-xl w-full object-cover h-48 hover:scale-110 transition-transform duration-300"
                  />
                  <div className="mt-3">
                    <h3 className="font-semibold text-foreground">Custom Mugs</h3>
                    <p className="text-sm text-muted-foreground">From $14.99</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
