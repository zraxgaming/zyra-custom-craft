
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  in_stock?: boolean;
  stock_status?: string;
}

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  customization?: any;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  customization = {},
  className = "",
  size = "default",
}) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (!product || !product.id) {
      toast({
        title: "Error",
        description: "Product information is missing.",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        customization,
        image: Array.isArray(product.images) && product.images.length > 0 
          ? product.images[0] 
          : undefined,
      });

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.in_stock === false || product.stock_status === 'out_of_stock';

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding || isOutOfStock || !user}
      size={size}
      className={`
        relative transition-all duration-300 ease-in-out transform
        hover:scale-105 hover:shadow-lg active:scale-95
        ${justAdded 
          ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
          : 'bg-primary hover:bg-primary/90'
        }
        ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
        ${!user ? 'opacity-75' : ''}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {isAdding ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : justAdded ? (
          <Check className="w-4 h-4 animate-bounce" />
        ) : (
          <ShoppingCart className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
        )}
        <span className="transition-all duration-200">
          {isAdding 
            ? "Adding..." 
            : justAdded 
              ? "Added!" 
              : isOutOfStock 
                ? "Out of Stock" 
                : !user
                  ? "Sign In to Add"
                  : "Add to Cart"
          }
        </span>
      </div>
    </Button>
  );
};
