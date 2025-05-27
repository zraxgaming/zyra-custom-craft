
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Gift, Zap, Heart, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    happyCustomers: 0
  });

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
    fetchStats();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('status', 'active')
        .limit(6);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .limit(8);

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' })
      ]);

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        happyCustomers: Math.floor((ordersRes.count || 0) * 0.8)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <>
      <SEOHead 
        title="Home - Zyra Store"
        description="Welcome to Zyra Store - Your destination for premium products with secure Ziina payments"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-fade-in">
              <Badge className="mb-6 bg-purple-100 text-purple-800 border-purple-200 animate-bounce-in">
                <Sparkles className="h-3 w-3 mr-1" />
                Welcome to Zyra Store
              </Badge>
              <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-8 animate-text-shimmer">
                Premium Shopping
                <br />
                <span className="text-4xl lg:text-6xl">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-in-up" style={{animationDelay: '200ms'}}>
                Discover amazing products with secure Ziina payments, gift cards, and personalized experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up" style={{animationDelay: '400ms'}}>
                <Button
                  onClick={() => navigate('/shop')}
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 hover:from-purple-700 hover:via-pink-700 hover:to-purple-900 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 animate-pulse"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                {user ? (
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 border-2 border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-105"
                  >
                    My Dashboard
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 border-2 border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-105"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center animate-scale-in card-premium border-gradient">
                <CardContent className="p-8">
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-float" />
                  <h3 className="text-3xl font-bold text-purple-600">{stats.totalProducts}+</h3>
                  <p className="text-gray-600 dark:text-gray-300">Premium Products</p>
                </CardContent>
              </Card>
              <Card className="text-center animate-scale-in card-premium border-gradient" style={{animationDelay: '100ms'}}>
                <CardContent className="p-8">
                  <ShoppingBag className="h-12 w-12 text-pink-600 mx-auto mb-4 animate-float" />
                  <h3 className="text-3xl font-bold text-pink-600">{stats.totalOrders}+</h3>
                  <p className="text-gray-600 dark:text-gray-300">Orders Delivered</p>
                </CardContent>
              </Card>
              <Card className="text-center animate-scale-in card-premium border-gradient" style={{animationDelay: '200ms'}}>
                <CardContent className="p-8">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4 animate-float" />
                  <h3 className="text-3xl font-bold text-red-500">{stats.happyCustomers}+</h3>
                  <p className="text-gray-600 dark:text-gray-300">Happy Customers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Explore our curated collections</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in hover-3d-lift card-premium border-gradient"
                  style={{animationDelay: `${index * 100}ms`}}
                  onClick={() => navigate(`/shop?category=${category.slug}`)}
                >
                  <CardContent className="p-6 text-center">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-16 h-16 mx-auto mb-4 rounded-full object-cover animate-float"
                      />
                    ) : (
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-float">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Handpicked items just for you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in hover-3d-lift card-premium border-gradient"
                  style={{animationDelay: `${index * 100}ms`}}
                  onClick={() => navigate(`/product/${product.slug}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-xl"
                      />
                      {product.is_new && (
                        <Badge className="absolute top-3 left-3 bg-green-500 text-white animate-pulse">
                          New
                        </Badge>
                      )}
                      {product.discount_percentage > 0 && (
                        <Badge className="absolute top-3 right-3 bg-red-500 text-white animate-pulse">
                          -{product.discount_percentage}%
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">({product.review_count})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-purple-600">${product.price}</span>
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Zyra?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Premium features for the best shopping experience</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center animate-scale-in card-premium border-gradient">
                <CardContent className="p-8">
                  <Zap className="h-16 w-16 text-purple-600 mx-auto mb-6 animate-pulse" />
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Secure Ziina Payments</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Pay securely with Ziina's licensed payment gateway trusted by thousands.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center animate-scale-in card-premium border-gradient" style={{animationDelay: '100ms'}}>
                <CardContent className="p-8">
                  <Gift className="h-16 w-16 text-pink-600 mx-auto mb-6 animate-float" />
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Digital Gift Cards</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Send instant gift cards to loved ones with personalized messages.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center animate-scale-in card-premium border-gradient" style={{animationDelay: '200ms'}}>
                <CardContent className="p-8">
                  <Heart className="h-16 w-16 text-red-500 mx-auto mb-6 animate-bounce" />
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Personalized Experience</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Curated recommendations and wishlist features tailored just for you.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;
