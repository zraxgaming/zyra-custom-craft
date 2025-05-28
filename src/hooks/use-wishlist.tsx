
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { WishlistItem } from '@/types/wishlist';

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addItem: async () => {},
  removeItem: async () => {},
  isInWishlist: () => false,
  isLoading: false,
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
        .from('wishlist_items')
        .select(`
          *,
          products (
            id,
            name,
            slug,
            price,
            images,
            rating,
            review_count
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const wishlistItems = data?.map(item => ({
        ...item,
        ...item.products,
        product_id: item.product_id
      })) || [];

      setItems(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      if (error) throw error;
      await fetchWishlistItems();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await fetchWishlistItems();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      isInWishlist,
      isLoading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
