
import React from "react";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">My Wishlist</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-24 w-24 text-gray-400 mx-auto mb-8" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save items you love for later!</p>
            <Button>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <p className="text-lg font-bold text-primary mb-4">${item.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleAddToCart(item)}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => removeItem(item.productId)}
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Wishlist;
