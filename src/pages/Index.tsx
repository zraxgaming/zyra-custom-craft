import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useWishlist } from '@/hooks/use-wishlist';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
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
        .eq('status', 'published')
        .limit(6);

      if (error) throw error;

      const transformedProducts: Product[] = (data || []).map(product => ({
        ...product,
        images: Array.isArray(product.images) 
          ? product.images.filter((img): img is string => typeof img === 'string')
          : [],
        image_url: Array.isArray(product.images) && product.images.length > 0 
          ? (typeof product.images[0] === 'string' ? product.images[0] : '')
          : ''
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
      1
    );
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      await addToWishlist(productId);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Zyra Custom Craft - Premium Customizable Products"
        description="Discover premium customizable products at Zyra Custom Craft. Transform ordinary items into personalized masterpieces."
        keywords="custom products, personalized gifts, crafting, UAE, customization"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent animate-slide-in-left">
              Welcome to Zyra
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 animate-slide-in-right">
              Transform ordinary products into extraordinary personalized masterpieces
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 transition-all duration-300">
                <Link to="/shop">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600 hover:scale-105 transition-all duration-300">
                <Link to="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our handpicked selection of premium customizable products
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => {
                const isInCart = !!cart.find(item => item.product_id === product.id);
                return (
                  <Card 
                    key={product.id} 
                    className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200 bg-white dark:bg-gray-800 overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden">
                      <Link to={`/product/${product.slug}`}>
                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-6xl text-gray-400">📦</div>
                            </div>
                          )}
                        </div>
                      </Link>
                      
                      <div className="absolute top-4 left-4 space-y-2">
                        {product.is_featured && (
                          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-pulse">
                            Featured
                          </Badge>
                        )}
                        {product.is_new && (
                          <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            New
                          </Badge>
                        )}
                        {product.discount_percentage && product.discount_percentage > 0 && (
                          <Badge variant="destructive" className="animate-bounce">
                            -{product.discount_percentage}%
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 ${
                          isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'
                        }`}
                        onClick={() => handleAddToWishlist(product.id)}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors duration-300">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {product.short_description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {product.short_description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-purple-600">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.discount_percentage && product.discount_percentage > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ${(product.price / (1 - product.discount_percentage / 100)).toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          {product.rating && product.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                              <span className="text-xs text-gray-500">({product.review_count})</span>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          disabled={!product.in_stock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {isInCart ? "In Cart" : (product.in_stock ? 'Add to Cart' : 'Out of Stock')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:scale-105 transition-all duration-300">
              <Link to="/shop">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
