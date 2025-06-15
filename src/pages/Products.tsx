import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { Product } from "@/types/product";
import SEOHead from "@/components/seo/SEOHead";

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'published');

        if (error) throw error;
        
        // Transform the data to match our Product interface
        const transformedProducts: Product[] = (data || []).map(product => ({
          ...product,
          images: Array.isArray(product.images) 
            ? product.images.filter(img => typeof img === 'string') as string[]
            : [],
          is_featured: product.is_featured || false,
          is_customizable: product.is_customizable || false,
          stock_quantity: product.stock_quantity || 0
        }));
        
        setProducts(transformedProducts);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  if (loading) {
    return (
      <>
        <SEOHead
          title="Our Products - Zyra Custom Craft"
          description="Browse all our published premium customizable products."
          url="https://shopzyra.vercel.app/products"
        />
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Our Products - Zyra Custom Craft"
        description="Browse all our published premium customizable products."
        url="https://shopzyra.vercel.app/products"
      />
      <Navbar />
      <div className="min-h-screen bg-background py-12 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-slide-in-down">
            <h1 className="text-4xl font-bold mb-2 animate-bounce-in">Our Products</h1>
            <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>Discover our amazing collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const imageUrl = Array.isArray(product.images) && product.images.length > 0 
                ? product.images[0] 
                : '/placeholder-product.jpg';

              return (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in overflow-hidden bg-gradient-to-br from-card/90 to-card border-border/50 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-125 group-hover:rotate-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.jpg';
                      }}
                    />
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in">
                        <Badge variant="destructive" className="animate-pulse">Out of Stock</Badge>
                      </div>
                    )}
                    {product.is_featured && (
                      <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse-glow">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
                    
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 transition-all duration-300 hover:scale-125 ${
                              star <= (product.rating || 0)
                                ? "fill-yellow-400 text-yellow-400 animate-pulse"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.review_count || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary animate-pulse-glow">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        images: product.images
                      }}
                      disabled={!product.in_stock}
                      className="hover:scale-105 transition-all duration-300"
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 animate-bounce-in">
              <h2 className="text-2xl font-bold mb-4">No products found</h2>
              <p className="text-muted-foreground">Check back later for new products!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;
