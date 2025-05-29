
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Grid, Sparkles } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  icon?: string;
  product_count?: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Add mock product counts for demonstration
      const categoriesWithCounts = (data || []).map(category => ({
        ...category,
        product_count: Math.floor(Math.random() * 50) + 5
      }));

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Categories - Zyra Custom Craft"
          description="Browse all product categories at Zyra Custom Craft. Find the perfect items for customization."
        />
        <Navbar />
        <Container className="py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Loading categories...</p>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <SEOHead 
        title="Categories - Zyra Custom Craft"
        description="Browse all product categories at Zyra Custom Craft. Find the perfect items for customization across various categories."
        keywords="product categories, custom items, personalized products, crafting categories"
      />
      <Navbar />
      
      <div className="py-16">
        <Container>
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="h-10 w-10 text-purple-600 animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Product Categories
              </h1>
              <Sparkles className="h-10 w-10 text-purple-600 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our diverse range of customizable products across different categories. 
              Each category offers unique opportunities for personalization and creativity.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <Grid className="h-5 w-5 text-purple-600" />
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 text-lg px-4 py-2">
                {categories.length} Categories Available
              </Badge>
            </div>
          </div>

          {categories.length === 0 ? (
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm animate-scale-in">
              <CardContent className="p-16 text-center">
                <Grid className="h-20 w-20 text-gray-400 mx-auto mb-6 animate-float" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No Categories Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto">
                  We're working on adding exciting product categories. Check back soon for amazing customizable items!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <Link 
                  key={category.id} 
                  to={`/shop?category=${category.slug}`}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="h-full border-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 overflow-hidden">
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 relative overflow-hidden">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {category.icon ? (
                              <div className="text-6xl animate-bounce">{category.icon}</div>
                            ) : (
                              <div className="text-8xl text-purple-400 animate-pulse">📦</div>
                            )}
                          </div>
                        )}
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Product count badge */}
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {category.product_count} items
                          </span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 mb-2">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
                              {category.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                          <Badge 
                            variant="secondary" 
                            className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                          >
                            Customizable ✨
                          </Badge>
                          <div className="text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                            Explore →
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Call to Action */}
          {categories.length > 0 && (
            <div className="text-center mt-16 animate-slide-in-up">
              <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white overflow-hidden">
                <CardContent className="p-12 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
                    <p className="text-xl mb-8 text-purple-100">
                      Browse our complete product collection and bring your ideas to life
                    </p>
                    <Link 
                      to="/shop"
                      className="inline-flex items-center gap-3 bg-white text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Grid className="h-5 w-5" />
                      Shop All Products
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Categories;
