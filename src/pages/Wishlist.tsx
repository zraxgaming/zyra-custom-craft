
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, Trash2, Plus } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";

const Wishlist = () => {
  const { items, removeItem, isLoading } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { toast } = useToast();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeItem(productId);
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.product_id,
      name: item.name,
      price: item.price,
      image: item.images?.[0],
      quantity: 1
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
        <SEOHead title="My Wishlist" description="Your saved items and favorites" />
        <Navbar />
        <Container className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                My Wishlist
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse bg-white/80 backdrop-blur-sm border-purple-200/50">
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <SEOHead 
        title="My Wishlist - Zyra Custom Craft"
        description="Your saved items and favorites at Zyra Custom Craft"
        keywords="wishlist, favorites, saved items, custom products"
      />
      <Navbar />
      
      <Container className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full w-fit mx-auto mb-6 animate-scale-in">
              <Heart className="h-12 w-12 text-purple-600" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              My Wishlist
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your saved treasures await! {items.length > 0 && `You have ${items.length} item${items.length === 1 ? '' : 's'} saved.`}
            </p>
          </div>

          {items.length === 0 ? (
            <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-purple-200/50 shadow-xl animate-fade-in">
              <CardContent className="text-center py-12">
                <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full w-fit mx-auto mb-6 animate-bounce">
                  <Heart className="h-16 w-16 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring our amazing products and save your favorites!
                </p>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/shop">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Start Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="group overflow-hidden bg-white/80 backdrop-blur-sm border-purple-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${item.slug}`}>
                      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="h-16 w-16 text-purple-400" />
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="absolute top-3 right-3">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                        onClick={() => handleRemoveFromWishlist(item.product_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <Link to={`/product/${item.slug}`}>
                      <h4 className="font-bold text-lg mb-2 hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                        {item.name}
                      </h4>
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-purple-600">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                          {item.review_count && (
                            <span className="text-sm text-muted-foreground">
                              ({item.review_count})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
