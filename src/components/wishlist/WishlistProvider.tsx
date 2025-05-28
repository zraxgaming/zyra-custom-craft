
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWishlistFromDatabase();
    } else {
      loadWishlistFromLocalStorage();
    }
  }, [user]);

  const loadWishlistFromDatabase = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          products!wishlists_product_id_fkey (
            id,
            name,
            price,
            images
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const wishlistItems: WishlistItem[] = (data || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || 'Unknown Product',
        price: item.products?.price || 0,
        image: Array.isArray(item.products?.images) && item.products.images.length > 0 
          ? item.products.images[0] 
          : item.products?.images || '/placeholder.svg'
      }));

      setItems(wishlistItems);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      loadWishlistFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadWishlistFromLocalStorage = () => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
  };

  const saveWishlistToLocalStorage = (wishlistItems: WishlistItem[]) => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  };

  const addItem = async (newItem: Omit<WishlistItem, 'id'>) => {
    const existingItem = items.find(item => item.productId === newItem.productId);
    if (existingItem) return;

    const wishlistItem: WishlistItem = {
      ...newItem,
      id: crypto.randomUUID(),
    };

    const updatedItems = [...items, wishlistItem];
    setItems(updatedItems);
    
    if (user) {
      await saveWishlistToDatabase(updatedItems);
    } else {
      saveWishlistToLocalStorage(updatedItems);
    }
  };

  const saveWishlistToDatabase = async (wishlistItems: WishlistItem[]) => {
    if (!user) return;

    try {
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id);

      const wishlistData = wishlistItems.map(item => ({
        user_id: user.id,
        product_id: item.productId
      }));

      if (wishlistData.length > 0) {
        const { error } = await supabase
          .from('wishlists')
          .insert(wishlistData);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving wishlist to database:', error);
    }
  };

  const removeItem = async (productId: string) => {
    const updatedItems = items.filter(item => item.productId !== productId);
    setItems(updatedItems);
    
    if (user) {
      await saveWishlistToDatabase(updatedItems);
    } else {
      saveWishlistToLocalStorage(updatedItems);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const itemCount = items.length;

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      isInWishlist,
      itemCount,
      isLoading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
