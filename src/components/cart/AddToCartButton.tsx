
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Loader2 } from 'lucide-react';
import { useCart } from './CartProvider';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    images?: string[];
  };
  quantity?: number;
  customization?: any;
  className?: string;
  disabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  customization,
  className = "",
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const { addToCart, items } = useCart();
  const { toast } = useToast();

  const isInCart = items.some(item => item.product_id === product.id);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image_url: product.image_url || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined),
        customization
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || loading}
      className={`animate-scale-in hover:scale-105 transition-all duration-300 ${className}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Adding...
        </div>
      ) : isInCart ? (
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 animate-bounce" />
          In Cart
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 animate-bounce" />
          Add to Cart
        </div>
      )}
    </Button>
  );
};

export default AddToCartButton;
