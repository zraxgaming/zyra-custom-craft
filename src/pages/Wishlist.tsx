
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/components/cart/CartProvider';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { user } = useAuth();
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (item: any) => {
    try {
      await addToCart({
        productId: item.product_id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.images?.[0] || '/placeholder-product.jpg'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Sign in to view your wishlist</h1>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <Badge variant="secondary">{items.length} items</Badge>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 animate-scale-in">
            <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding items you love to your wishlist
            </p>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                      <p className="text-lg font-bold text-primary">${item.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 hover:scale-105 transition-transform"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromWishlist(item.product_id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
