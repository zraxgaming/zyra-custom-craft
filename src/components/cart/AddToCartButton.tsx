
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import { Product } from "@/types/product";

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
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
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
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          images: Array.isArray(product.images) ? product.images : [],
          slug: product.slug
        }
      });

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding || !product.in_stock}
      size={size}
      className={`
        relative transition-all duration-300 ease-in-out transform
        hover:scale-105 hover:shadow-lg active:scale-95
        ${justAdded 
          ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
          : 'bg-primary hover:bg-primary/90'
        }
        ${!product.in_stock ? 'opacity-50 cursor-not-allowed' : ''}
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
              : !product.in_stock 
                ? "Out of Stock" 
                : "Add to Cart"
          }
        </span>
      </div>
    </Button>
  );
};
