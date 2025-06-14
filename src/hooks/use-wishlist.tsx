
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image_url?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, "id">) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (item: Omit<WishlistItem, "id">) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.product_id === item.product_id);
      if (existingItem) {
        return prevItems;
      }
      return [...prevItems, { ...item, id: Date.now().toString() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product_id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const value: WishlistContextType = {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
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
