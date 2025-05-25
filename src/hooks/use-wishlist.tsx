
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { WishlistItem } from "@/types/cart";

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id'>) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setItems([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          id,
          product_id,
          products!wishlists_product_id_fkey (
            id,
            name,
            price,
            images,
            slug
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const wishlistItems: WishlistItem[] = (data || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || "Unknown Product",
        price: item.products?.price || 0,
        image: Array.isArray(item.products?.images) && item.products.images.length > 0 
          ? item.products.images[0] 
          : undefined,
        product: item.products ? {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          images: Array.isArray(item.products.images) ? item.products.images : [],
          slug: item.products.slug
        } : undefined
      }));

      setItems(wishlistItems);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to load wishlist.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (newItem: Omit<WishlistItem, 'id'>) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("wishlists")
        .insert({
          user_id: user.id,
          product_id: newItem.productId,
        })
        .select()
        .single();

      if (error) throw error;

      const wishlistItem: WishlistItem = {
        id: data.id,
        productId: newItem.productId,
        name: newItem.name,
        price: newItem.price,
        image: newItem.image,
        product: newItem.product,
      };

      setItems(prev => [...prev, wishlistItem]);

      toast({
        title: "Added to wishlist",
        description: `${newItem.name} has been added to your wishlist.`,
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist.",
        variant: "destructive",
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.productId !== productId));

      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive",
      });
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.productId === productId);
  };

  const value: WishlistContextType = {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
