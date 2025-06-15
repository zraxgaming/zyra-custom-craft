import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import SEOHead from "@/components/seo/SEOHead";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist();
  const { user } = useAuth();
  const { addToCart } = useCart(); // Get addToCart function from CartProvider
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    setIsEmpty(wishlist.length === 0);
  }, [wishlist]);

  const handleAddToCart = async (product: any) => {
    if (!product) return;
    await addToCart(
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.images[0] || "/placeholder-product.jpg",
      },
      1,
      {}
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SEOHead title="Wishlist - Loading..." />
        <h1 className="text-3xl font-bold mb-4">Wishlist</h1>
        <p className="text-muted-foreground">Loading your favorite items...</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <CardTitle><Skeleton className="h-5 w-3/4" /></CardTitle>
                <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-8 w-1/4 mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHead title="Wishlist - Zyra Custom Craft" description="View your wishlist and easily add your favorite items to the cart." />
      <h1 className="text-3xl font-bold mb-4">Wishlist</h1>
      {isEmpty ? (
        <div className="text-center py-12">
          <Heart className="h-10 w-10 mx-auto text-gray-400 mb-4" />
          <p className="text-muted-foreground">Your wishlist is currently empty.</p>
          {user ? (
            <Link to="/shop" className="text-primary hover:underline">
              Discover new items
            </Link>
          ) : (
            <p className="text-muted-foreground">
              <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to view your wishlist.
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="text-muted-foreground">Here are the items you've saved for later.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {wishlist.map((item) => (
              <Card key={item.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-destructive hover:bg-red-100 hover:text-red-600 rounded-full"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>AED {item.price.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent className="aspect-square overflow-hidden">
                  <img
                    src={item.images[0] || "/placeholder-product.jpg"}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </CardContent>
                <Separator />
                <Button
                  className="w-full rounded-none"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
