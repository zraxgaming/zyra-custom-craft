
import React from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRight, Star, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)"/>
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <Container className="relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <Star className="h-4 w-4 text-amber-500 fill-current" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Trusted by 10,000+ customers
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
              <span className="block text-gray-900 dark:text-white mb-2">
                Custom
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Excellence
              </span>
              <span className="block text-gray-900 dark:text-white text-4xl md:text-5xl lg:text-6xl mt-4">
                Delivered
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Premium custom products crafted with precision. From concept to creation, 
              we bring your vision to life with unmatched quality and attention to detail.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Materials and craftsmanship that exceed expectations</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast Turnaround</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quick delivery without compromising on quality</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Custom Design</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Personalized products tailored to your vision</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              asChild 
              size="lg" 
              className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
            >
              <Link to="/shop">
                Start Creating
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="h-14 px-10 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            >
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Custom Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">99%</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
