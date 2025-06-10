
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/components/cart/CartProvider';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async (product: any) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleAddToCart = async (product: any) => {
    await addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-700 rounded-2xl h-64 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute top-1/2 -right-20 w-60 h-60 bg-pink-400/20 rounded-full animate-float-delayed blur-xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-48 h-48 bg-blue-400/20 rounded-full animate-float blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-purple-600 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-text-shimmer">
              Featured Products
            </h2>
            <Sparkles className="h-8 w-8 text-pink-600 animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-in-up">
            Discover our handpicked selection of premium custom products
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 animate-bounce-in">
            <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-float" />
            <h3 className="text-2xl font-semibold mb-2">No Featured Products</h3>
            <p className="text-muted-foreground">Check back soon for amazing featured items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:scale-105 animate-slide-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    {Array.isArray(product.images) && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 to-pink-800 flex items-center justify-center">
                        <Sparkles className="h-16 w-16 text-purple-600 dark:text-purple-300 animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className={`p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-bounce-in ${
                        isInWishlist(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110 animate-bounce-in"
                      style={{ animationDelay: '100ms' }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg animate-pulse">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  {/* Stock Indicator */}
                  {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="destructive" className="animate-pulse">
                        Only {product.stock_quantity} left!
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </h3>
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 animate-fade-in">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-purple-600 animate-pulse">
                          ${product.price}
                        </div>
                        {product.compare_at_price && product.compare_at_price > product.price && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${product.compare_at_price}
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/product/${product.id}`}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-all duration-300 hover:scale-105 group/link"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>

                    {/* Product Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                          <Badge 
                            key={tagIndex} 
                            variant="secondary" 
                            className="text-xs animate-fade-in hover:scale-105 transition-transform duration-300"
                            style={{ animationDelay: `${tagIndex * 100}ms` }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12 animate-fade-in">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 group"
          >
            <Sparkles className="h-5 w-5 group-hover:animate-spin" />
            View All Products
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
