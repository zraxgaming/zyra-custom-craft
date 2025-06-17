
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/components/cart/CartProvider';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  rating: number;
  review_count: number;
  is_featured: boolean;
  discount_percentage?: number;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .limit(8);

      if (error) throw error;

      const formattedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        images: Array.isArray(product.images) 
          ? product.images.filter((img): img is string => typeof img === 'string')
          : [],
        slug: product.slug,
        rating: product.rating || 0,
        review_count: product.review_count || 0,
        is_featured: product.is_featured || false,
        discount_percentage: product.discount_percentage || 0
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Set some mock data for demonstration
      setProducts([
        {
          id: '1',
          name: 'Custom Photo Mug',
          price: 24.99,
          images: ['/placeholder-product.jpg'],
          slug: 'custom-photo-mug',
          rating: 4.8,
          review_count: 124,
          is_featured: true,
          discount_percentage: 15
        },
        {
          id: '2',
          name: 'Personalized T-Shirt',
          price: 19.99,
          images: ['/placeholder-product.jpg'],
          slug: 'personalized-t-shirt',
          rating: 4.6,
          review_count: 89,
          is_featured: true,
          discount_percentage: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = (product: Product) => {
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      slug: product.slug
    };
    addToWishlist(wishlistItem);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.images[0] || '/placeholder-product.jpg'
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <Container>
          <div className="text-center mb-12">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular custom products, loved by thousands of customers worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                  }}
                />
                {product.discount_percentage > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                    -{product.discount_percentage}%
                  </Badge>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleAddToWishlist(product)}
                    className="h-8 w-8 bg-white/80 backdrop-blur-sm"
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                
                <div className="flex items-center gap-2 mb-2">
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
                  <span className="text-sm text-muted-foreground">
                    ({product.review_count})
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discount_percentage > 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${(product.price / (1 - product.discount_percentage / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/product/${product.slug}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/shop">
              View All Products
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProducts;
