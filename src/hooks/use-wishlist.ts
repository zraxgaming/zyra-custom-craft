
import { useWishlist as useWishlistContext } from '@/contexts/WishlistContext';

export const useWishlist = () => {
  return useWishlistContext();
};
