
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, className }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, isLoading } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const handleClick = async () => {
    if (inWishlist) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "transition-all duration-300 hover:scale-110",
        inWishlist && "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-300",
          inWishlist && "fill-current"
        )}
      />
    </Button>
  );
};

export default WishlistButton;
