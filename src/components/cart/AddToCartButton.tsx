import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "./CartProvider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    is_customizable?: boolean;
    stock_quantity?: number;
  };
  disabled?: boolean;
  className?: string;
}

// Only show for standard products, animation effect tweaked for any use
const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  disabled = false,
  className = "",
}) => {
  const { cart, addToCart } = useCart();
  const { toast } = useToast();

  // Get latest stock for the product
  const maxStock =
    typeof product.stock_quantity === "number"
      ? product.stock_quantity
      : 99;

  const [quantity, setQuantity] = useState(1);

  const existingItem = cart.find((item) => item.product_id === product.id);
  const cartQuantity = existingItem ? existingItem.quantity : 0;
  const remainingStock = maxStock - cartQuantity;

  // Animation states for "fly-to-cart"
  const [animating, setAnimating] = useState(false);
  const [showFlyAnim, setShowFlyAnim] = useState(false);

  // Overhaul: Animate product image to cart icon
  const flyImage = () => {
    const img = document.createElement("img");
    img.src = product.images[0] || "/placeholder-product.jpg";
    img.className = "fixed z-[9999] pointer-events-none w-16 h-16 object-cover rounded-full shadow-2xl";
    img.style.left = `${window.innerWidth / 2 - 64}px`;
    img.style.top = `${window.innerHeight / 2 - 64}px`;
    document.body.appendChild(img);

    const cart = document.querySelector("#navbar-cart-icon") as HTMLElement;
    if (cart) {
      const cartRect = cart.getBoundingClientRect();
      img.animate([
        { left: img.style.left, top: img.style.top, opacity: 1, transform: "scale(1.1)" },
        { left: `${cartRect.left}px`, top: `${cartRect.top}px`, opacity: 0.3, transform: "scale(0.5)" }
      ], { duration: 700, easing: "cubic-bezier(.77,0,.18,1)" }).onfinish = () => img.remove();
    } else {
      setTimeout(() => img.remove(), 800);
    }
  };

  const handleAddToCart = async () => {
    if (disabled) return;

    // Validate stock
    if (quantity > remainingStock || remainingStock <= 0) {
      toast({
        title: "Stock Limit Reached",
        description: `Cannot add more than ${maxStock} of this product to your cart.`,
        variant: "destructive",
      });
      return;
    }

    flyImage();
    await addToCart(
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.images[0] || "/placeholder-product.jpg"
      },
      quantity
    );

    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart`,
    });
    setAnimating(true);
    setTimeout(() => setAnimating(false), 750);

    setQuantity(1);
  };

  return (
    <>
      <div className="relative flex items-center gap-2">
        {/* Decrease */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-8 h-8"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="px-2">{quantity}</span>
        {/* Increase */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={quantity >= remainingStock}
          aria-label="Increase quantity"
          onClick={() =>
            setQuantity((q) =>
              q < remainingStock ? q + 1 : q
            )
          }
          className="w-8 h-8"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Button
          onClick={handleAddToCart}
          disabled={
            disabled ||
            remainingStock <= 0
          }
          className={cn(
            "flex-1 w-full",
            className,
            animating && "animate-bounce animate-spin scale-105"
          )}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {existingItem ? "Add More" : "Add to Cart"}
        </Button>
      </div>
      {remainingStock <= 0 && (
        <div className="text-xs text-red-600 mt-1">
          No more in stock.
        </div>
      )}
      <style>{`
      @keyframes flyCart {
        0% { transform: translateY(0) scale(0.9) rotate(0deg);}
        90% { transform: translateY(-60px) scale(1.08) rotate(30deg);}
        100% { opacity: 0; transform: translateY(-100px) scale(0.1) rotate(360deg);}
      }
      .animate-fly-cart {
        animation: flyCart 0.7s cubic-bezier(0.2,0.7,0.6,1) forwards;
      }
      `}
      </style>
    </>
  );
};

export default AddToCartButton;
