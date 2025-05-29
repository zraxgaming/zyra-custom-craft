
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refetch: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  isLoading: false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: () => false,
  refetch: async () => {}
});

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          products (
            name,
            price,
            images,
            slug
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const wishlistItems = data?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.products?.name || '',
        price: item.products?.price || 0,
        images: Array.isArray(item.products?.images) ? item.products.images : [],
        slug: item.products?.slug || ''
      })) || [];

      setItems(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      if (error) throw error;
      
      await fetchWishlistItems();
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      
      await fetchWishlistItems();
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  const refetch = async () => {
    await fetchWishlistItems();
  };

  return (
    <WishlistContext.Provider value={{
      items,
      isLoading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      refetch
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
