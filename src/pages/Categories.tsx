
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Sparkles, Star, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <>
      <SEOHead 
        title="Categories - Zyra"
        description="Explore all product categories at Zyra. Find the perfect customizable products for your needs."
        url="https://shopzyra.vercel.app/categories"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-8 animate-bounce-in shadow-2xl">
                <Sparkles className="h-12 w-12 text-white animate-wiggle" />
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent animate-text-shimmer">
                Product Categories
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                Discover our curated collection of premium customizable products, organized by category for your convenience.
              </p>
              <div className="flex items-center justify-center gap-2 mt-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <Star className="h-5 w-5 text-yellow-500 animate-pulse" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Each category features hand-picked, customizable items</span>
              </div>
            </div>
          </Container>
        </section>

        {/* Categories Grid */}
        <Container className="pb-20">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-8">
                    <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl mb-6 animate-pulse"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded w-3/4 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Link 
                  key={category.id} 
                  to={`/shop?category=${category.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 animate-scale-in border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-white to-pink-100 dark:from-purple-900/30 dark:via-gray-800 dark:to-pink-900/30 h-56 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        {category.image_url ? (
                          <img 
                            src={category.image_url} 
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Package className="h-16 w-16 text-purple-400 dark:text-purple-300 mb-4 animate-float" />
                            <Zap className="h-8 w-8 text-pink-400 dark:text-pink-300 animate-pulse" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <div className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg">
                            <ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 text-gray-900 dark:text-white">
                            {category.name}
                          </h3>
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center">
                            <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        
                        {category.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {category.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 border-0 text-xs font-medium px-3 py-1">
                            {category.icon || 'Premium'} Collection
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            <span>Explore</span>
                            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-8 shadow-xl">
                <Package className="h-16 w-16 text-purple-400 dark:text-purple-300 animate-float" />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">No Categories Available</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                We're curating amazing categories for you. Check back soon or browse all our premium products.
              </p>
              <Link 
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold text-lg"
              >
                <Sparkles className="h-6 w-6 mr-3" />
                Browse All Products
                <ArrowRight className="h-5 w-5 ml-3" />
              </Link>
            </div>
          )}
        </Container>
        
        <Footer />
      </div>
    </>
  );
};

export default Categories;
