
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/components/cart/CartProvider";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedProductsProps {
  category?: string;
  limit?: number;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ category, limit = 4 }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*')
          .eq('status', 'published')
          .eq('is_featured', true)
          .limit(limit);

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform the data to ensure proper typing
        const transformedProducts: Product[] = (data || []).map(product => ({
          ...product,
          images: Array.isArray(product.images) 
            ? product.images.filter((img): img is string => typeof img === 'string')
            : [],
          is_featured: product.is_featured || false,
          is_customizable: product.is_customizable || false,
          stock_quantity: product.stock_quantity || 0
        }));
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Could not fetch featured products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit]);

  const renderStars = (rating: number | undefined) => {
    if (typeof rating !== 'number' || rating === 0) return <span className="text-sm text-muted-foreground">No reviews yet</span>;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
        {halfStar && <Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <CardTitle><Skeleton className="h-5 w-3/4" /></CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const imageUrl = Array.isArray(product.images) && product.images.length > 0 
          ? product.images[0] 
          : '/placeholder-product.jpg';

        return (
          <Card key={product.id} className="bg-card text-card-foreground shadow-md transition-shadow duration-300 hover:shadow-lg">
            <Link to={`/product/${product.slug}`}>
              <div className="relative">
                <AspectRatio ratio={4 / 3}>
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="object-cover rounded-t-md w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.jpg';
                    }}
                  />
                </AspectRatio>
              </div>
              <CardHeader className="pt-4">
                <CardTitle className="text-lg font-semibold line-clamp-1">{product.name}</CardTitle>
              </CardHeader>
            </Link>
            <CardContent className="py-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.short_description || product.description}</p>
                </div>
              </div>
              <div className="mt-2">
                {renderStars(product.rating)}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4">
              <span className="text-xl font-bold text-primary">AED {product.price.toFixed(2)}</span>
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: imageUrl
                  }, 1);
                }} 
                variant="outline"
                disabled={!product.in_stock}
              >
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default FeaturedProducts;
