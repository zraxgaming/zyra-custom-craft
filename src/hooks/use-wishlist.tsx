
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  items: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (productId: string) => {
    setItems(prev => [...prev.filter(id => id !== productId), productId]);
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prev => prev.filter(id => id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.includes(productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
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

// Legacy hook for backward compatibility
export const useWishlistHook = useWishlist;
