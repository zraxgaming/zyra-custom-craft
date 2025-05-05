
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="hero-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Your Design, <br />
              <span className="text-zyra-light-purple">Your Style</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-md">
              Create custom products that truly reflect your personality.
              Easy to design, high-quality results, fast delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-white hover:bg-gray-100 text-zyra-purple font-medium px-8 py-6 rounded-md">
                <Link to="/shop">
                  Shop Now
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent hover:bg-white/10 text-white border-white font-medium px-8 py-6 rounded-md">
                <Link to="/customize" className="flex items-center gap-2">
                  Customize Now <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-zyra-light-purple/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg transform translate-y-8">
                  <img 
                    src="https://images.unsplash.com/photo-1607581072646-80a005fd7614?w=500&auto=format&fit=crop&q=60" 
                    alt="Custom Phone Case" 
                    className="rounded-lg w-full object-cover h-40"
                  />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60" 
                    alt="Custom T-shirt" 
                    className="rounded-lg w-full object-cover h-40"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1607038233846-064b5142c885?w=500&auto=format&fit=crop&q=60" 
                    alt="Custom Hoodie" 
                    className="rounded-lg w-full object-cover h-40"
                  />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg transform translate-y-8">
                  <img 
                    src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60" 
                    alt="Custom Mug" 
                    className="rounded-lg w-full object-cover h-40"
                  />
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
