
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "./CartProvider";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
  disabled?: boolean;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  product, 
  disabled = false,
  className = ""
}) => {
  const { addToCart, items } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const existingItem = items.find(item => item.id === product.id);

  const handleAddToCart = () => {
    if (disabled) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder-product.jpg',
      quantity: quantity
    });

    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart`,
    });

    setQuantity(1);
  };

  if (existingItem) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="h-8 w-8"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(quantity + 1)}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={disabled}
          className="flex-1"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add More
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`w-full ${className}`}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
