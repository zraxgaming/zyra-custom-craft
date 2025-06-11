
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
      
      const transformedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        images: Array.isArray(product.images) 
          ? (product.images as string[]).filter(img => typeof img === 'string')
          : [],
        slug: product.slug,
        rating: product.rating || 0,
        review_count: product.review_count || 0,
        discount_percentage: product.discount_percentage || 0,
        is_new: product.is_new || false,
        featured: product.featured || false,
        in_stock: product.in_stock || true,
        short_description: product.short_description || ''
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link to="/shop">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No Featured Products</h3>
              <p className="text-muted-foreground mb-6">
                Check back soon for our featured products!
              </p>
              <Button asChild>
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
