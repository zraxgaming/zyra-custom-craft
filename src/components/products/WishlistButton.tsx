
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, className }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, isLoading } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-colors",
        inWishlist && "text-red-500",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
    </Button>
  );
};

export default WishlistButton;
