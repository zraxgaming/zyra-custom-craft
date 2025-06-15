
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

  // Customization control
  const [customization, setCustomization] = useState<any>({});
  const [customModalOpen, setCustomModalOpen] = useState(false);

  const isCustomizable = !!product.is_customizable;
  const existingItem = cart.find((item) => item.product_id === product.id);
  const cartQuantity = existingItem ? existingItem.quantity : 0;
  const remainingStock = maxStock - cartQuantity;

  // Customization required logic
  const hasCustomization = () => {
    if (!customization || typeof customization !== "object") return false;
    return Object.values(customization).some(val =>
      typeof val === "string"
        ? val.trim() !== ""
        : val && typeof val === "object"
          ? Object.keys(val).length > 0
          : Boolean(val)
    );
  };

  // Animation states for "fly-to-cart"
  const [animating, setAnimating] = useState(false);
  const [showFlyAnim, setShowFlyAnim] = useState(false);

  // Main "add to cart" with animation
  const handleAddToCart = async () => {
    if (disabled) return;
    // Enforce customization on custom products
    if (isCustomizable && !hasCustomization()) {
      setCustomModalOpen(true);
      toast({
        title: "Customization Required",
        description:
          "Please enter customization details before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    // Validate stock
    if (quantity > remainingStock || remainingStock <= 0) {
      toast({
        title: "Stock Limit Reached",
        description: `Cannot add more than ${maxStock} of this product to your cart.`,
        variant: "destructive",
      });
      return;
    }

    // Show fly animation
    setShowFlyAnim(true);
    setTimeout(() => setShowFlyAnim(false), 700);

    await addToCart(
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.images[0] || "/placeholder-product.jpg",
      },
      quantity,
      isCustomizable ? customization : {}
    );

    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart`,
    });
    setAnimating(true);
    setTimeout(() => setAnimating(false), 750);

    setQuantity(1);
    setCustomization({});
    setCustomModalOpen(false);
  };

  return (
    <>
      {/* Customization Modal */}
      {isCustomizable && customModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 relative">
            <h2 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Customize Your Product</h2>
            <label className="block font-medium mb-1 text-gray-800 dark:text-gray-200">Custom Text</label>
            <input
              type="text"
              placeholder="Enter custom text"
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-primary text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 mb-2"
              value={customization.text || ""}
              onChange={e => setCustomization({ ...customization, text: e.target.value })}
            />
            <div className="flex gap-3 mt-4 justify-end">
              <Button onClick={() => setCustomModalOpen(false)} variant="outline">Cancel</Button>
              <Button
                onClick={handleAddToCart}
                disabled={!hasCustomization()}
              >Add to Cart</Button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex items-center gap-2">
        {/* Cart animation box */}
        {showFlyAnim && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 animate-fly-cart bg-primary rounded-lg shadow-lg p-3 flex items-center">
            <ShoppingCart className="h-5 w-5 text-white animate-spin" />
            <span className="ml-2 text-white text-xs font-bold">{quantity}</span>
          </div>
        )}
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
            (isCustomizable && !hasCustomization()) ||
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
