
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { Heart, ShoppingCart, Star, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { user } = useAuth();
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity: 1
      });
      
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Please Sign In</h3>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your wishlist.
          </p>
          <Button onClick={() => window.location.href = '/auth'} className="animate-bounce">
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 animate-fade-in">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-bounce" />
          <h3 className="text-lg font-semibold mb-2">Your Wishlist is Empty</h3>
          <p className="text-muted-foreground mb-6">
            Start adding products you love to your wishlist!
          </p>
          <Button onClick={() => window.location.href = '/shop'} className="animate-pulse">
            Browse Products
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-6 w-6 text-primary animate-pulse" />
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <span className="text-muted-foreground">({items.length} items)</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFromWishlist(item.product_id)}
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                {item.product?.images && item.product.images.length > 0 ? (
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                    <Link to={`/product/${item.product?.slug}`}>
                      {item.product?.name}
                    </Link>
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.product?.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({item.product?.review_count || 0})
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    ${item.product?.price?.toFixed(2)}
                  </span>
                  
                  <Button
                    onClick={() => item.product && handleAddToCart(item.product)}
                    size="sm"
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
