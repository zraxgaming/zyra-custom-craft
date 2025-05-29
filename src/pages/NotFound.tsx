
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Home, ArrowLeft, Search, Sparkles, Zap, Star } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 animate-fade-in">
      <Navbar />
      
      <Container className="py-20">
        <div className="max-w-4xl mx-auto text-center space-y-12 animate-scale-in">
          {/* Animated 404 */}
          <div className="relative mb-12 animate-bounce-in">
            <div className="absolute inset-0 opacity-20 animate-pulse">
              <div className="w-full h-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 blur-3xl"></div>
            </div>
            <div className="relative">
              <h1 className="text-[20rem] md:text-[25rem] font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-text-shimmer leading-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl md:text-9xl animate-spin-slow">
                  <Sparkles className="text-purple-300 dark:text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          <div className="space-y-8 animate-slide-in-up">
            <div className="flex justify-center space-x-4 mb-8">
              <Star className="h-8 w-8 text-yellow-400 animate-pulse" />
              <Zap className="h-8 w-8 text-purple-500 animate-bounce" />
              <Star className="h-8 w-8 text-pink-400 animate-pulse" />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-glow dark:from-white dark:via-purple-300 dark:to-pink-300">
              Oops! Page Not Found
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              The page you're looking for seems to have vanished into the digital void. 
              But don't worry, our amazing products are still here!
            </p>
          </div>
          
          {/* Search Box */}
          <div className="max-w-md mx-auto animate-scale-in" style={{animationDelay: '0.4s'}}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors h-5 w-5" />
              <input 
                type="search"
                placeholder="Search for products..."
                className="w-full py-4 pl-12 pr-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-lg placeholder-gray-400 hover:shadow-xl group-hover:scale-105"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/shop?search=${encodeURIComponent(e.currentTarget.value)}`);
                  }
                }}
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-in-up" style={{animationDelay: '0.6s'}}>
            <Button 
              onClick={() => navigate('/home')}
              className="group relative h-16 px-8 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 overflow-hidden"
              size="lg"
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              <Home className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              Go to Homepage
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Button>
            
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="group h-16 px-8 border-2 border-purple-300 hover:border-purple-500 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-purple-50 dark:hover:bg-purple-900/20"
              size="lg"
            >
              <ArrowLeft className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              Go Back
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/0 via-purple-100/50 to-purple-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
            </Button>
          </div>
          
          {/* Floating Elements */}
          <div className="relative">
            <div className="absolute -top-20 left-1/4 w-20 h-20 bg-purple-200/30 dark:bg-purple-700/30 rounded-full animate-float"></div>
            <div className="absolute -top-10 right-1/3 w-16 h-16 bg-pink-200/30 dark:bg-pink-700/30 rounded-full animate-float-reverse"></div>
            <div className="absolute top-10 left-1/3 w-12 h-12 bg-orange-200/30 dark:bg-orange-700/30 rounded-full animate-float"></div>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default NotFound;
