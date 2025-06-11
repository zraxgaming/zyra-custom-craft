
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/products/ProductCard';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  rating: number;
  review_count: number;
  discount_percentage: number;
  is_new: boolean;
  featured: boolean;
  in_stock: boolean;
  short_description: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show fake loading for 1 second
    setLoading(true);
    setTimeout(() => {
      fetchFeaturedProducts();
      setLoading(false);
    }, 1000);
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('status', 'published')
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-elegant">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our most popular custom products, crafted with care and attention to detail
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading featured products...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-elegant">
              {products.map((product, index) => (
                <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12 animate-fade-in-elegant" style={{ animationDelay: '0.8s' }}>
              <Button asChild size="lg" className="btn-professional">
                <Link to="/shop">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <Card className="text-center py-12 card-professional">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No Featured Products</h3>
              <p className="text-muted-foreground mb-6">
                Check back soon for our featured products!
              </p>
              <Button asChild className="btn-professional">
                <Link to="/shop">Browse All Products</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
