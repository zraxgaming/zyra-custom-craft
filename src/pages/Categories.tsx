
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
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
        url="https://zyra.lovable.app/categories"
      />
      <div className="min-h-screen bg-background floating-dots-bg particle-field-bg">
        <Navbar />
        
        <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-background">
          <Container>
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Product Categories
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover our wide range of customizable products across different categories.
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="w-full h-48 bg-muted/50 rounded-lg mb-4"></div>
                    <div className="h-6 bg-muted/50 rounded mb-2"></div>
                    <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Link 
                  key={category.id} 
                  to={`/shop?category=${category.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="relative overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        {category.image_url ? (
                          <img 
                            src={category.image_url} 
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-primary/40" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      
                      {category.description && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {category.icon || 'Category'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Explore →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">No Categories Found</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We're working on adding categories. Check back soon or browse all products.
              </p>
              <Link 
                to="/shop"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse All Products
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
