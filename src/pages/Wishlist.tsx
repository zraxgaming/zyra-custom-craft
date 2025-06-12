
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import { useWishlist } from '@/hooks/use-wishlist';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/seo/SEOHead';

const Wishlist = () => {
  const { items, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addToCart({
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.images?.[0],
      images: item.images,
      slug: item.slug
    });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Wishlist - Zyra Custom Craft"
          description="View and manage your saved products in your wishlist."
        />
        <Navbar />
        <Container className="py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your wishlist...</p>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Wishlist - Zyra Custom Craft"
        description="View and manage your saved products in your wishlist."
      />
      <Navbar />
      
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save items you love to your wishlist and shop them later.
              </p>
              <Button asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.images[0] || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                  <p className="text-lg font-bold text-primary mb-4">
                    ${item.price.toFixed(2)}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeFromWishlist(item.product_id)}
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Wishlist;
