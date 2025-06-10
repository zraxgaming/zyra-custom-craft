
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/components/cart/CartProvider';
import { Heart, ShoppingCart, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import SEOHead from '@/components/seo/SEOHead';

const Wishlist = () => {
  const { items, removeFromWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (item: any) => {
    await addToCart({
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : undefined
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30">
        <Navbar />
        <Container>
          <div className="py-12">
            <div className="text-center mb-12 animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-96 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 rounded-2xl h-64 mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30">
        <SEOHead 
          title="Wishlist - Zyra Custom Craft"
          description="View and manage your favorite products in your wishlist."
        />
        <Navbar />
        
        <div className="py-16">
          <Container>
            <div className="text-center py-16 animate-bounce-in">
              <div className="relative mb-8">
                <Heart className="h-24 w-24 text-muted-foreground mx-auto animate-float" />
                <Sparkles className="h-8 w-8 text-pink-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Your Wishlist is Empty
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Save your favorite products to your wishlist and never lose track of what you love!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                    <ShoppingBag className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                    Discover Products
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="outline" className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 hover:scale-105 transition-all duration-300 group">
                    <ShoppingCart className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30">
      <SEOHead 
        title={`Wishlist (${items.length}) - Zyra Custom Craft`}
        description="View and manage your favorite products in your wishlist."
      />
      <Navbar />
      
      <div className="py-12">
        <Container>
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-pink-600 animate-bounce" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                My Wishlist
              </h1>
              <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <Card 
                key={item.id} 
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:scale-105 animate-slide-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    {Array.isArray(item.images) && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/50 dark:to-purple-900/50 flex items-center justify-center">
                        <Sparkles className="h-16 w-16 text-pink-600 dark:text-pink-300 animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 text-red-500 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Wishlist Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-pink-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                      <Heart className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                      {item.name}
                    </h3>

                    <div className="text-2xl font-bold text-pink-600 animate-pulse">
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      
                      <Link to={`/product/${item.product_id}`}>
                        <Button variant="outline" size="icon" className="hover:scale-110 transition-all duration-300">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Added {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 group"
            >
              <ShoppingBag className="h-5 w-5 group-hover:animate-bounce" />
              Continue Shopping
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
