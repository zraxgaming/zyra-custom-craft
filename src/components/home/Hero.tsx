
import React from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRight, Star, Heart, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-lg animate-bounce-in">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Premium Quality Products
            </span>
            <Star className="h-4 w-4 text-amber-500" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer">
                Create
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Something
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-primary bg-clip-text text-transparent animate-text-shimmer">
                Amazing
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-in-up">
              Transform your ideas into premium custom products with our expert craftsmanship and cutting-edge technology
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-600 dark:text-gray-400 animate-slide-in-up">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Made with Love</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              <span>Premium Quality</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Button 
              asChild 
              size="lg" 
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/shop">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-primary hover:text-primary transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 animate-slide-in-up">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Custom Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">99%</div>
              <div className="text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
