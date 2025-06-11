
import React, { createContext, useContext, ReactNode } from 'react';
import { useWishlist as useWishlistHook } from './use-wishlist';

interface WishlistProviderProps {
  children: ReactNode;
}

const WishlistContext = createContext<ReturnType<typeof useWishlistHook> | undefined>(undefined);

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const wishlist = useWishlistHook();

  return (
    <WishlistContext.Provider value={wishlist}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
};
