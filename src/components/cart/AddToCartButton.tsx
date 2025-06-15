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
  };
  disabled?: boolean;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  product, 
  disabled = false,
  className = ""
}) => {
  const { cart, addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Customization state
  const [customization, setCustomization] = useState<any>({});
  const [customModalOpen, setCustomModalOpen] = useState(false);

  const isCustomizable = !!product.is_customizable;
  const existingItem = cart.find(item => item.product_id === product.id);

  // Helper for customization check
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

  // Main add-to-cart action
  const handleAddToCart = async () => {
    if (disabled) return;
    if (isCustomizable && !hasCustomization()) {
      setCustomModalOpen(true);
      toast({
        title: "Customization Required",
        description: "Please enter customization details before adding to cart.",
        variant: "destructive"
      });
      return;
    }
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
      description: `${quantity} ${product.name} added to your cart`
    });
    setQuantity(1);
    setCustomization({});
    setCustomModalOpen(false);
  };

  return (
    <>
      {/* Customization Modal - improved contrast/theme */}
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

      <Button
        onClick={handleAddToCart}
        disabled={disabled}
        className={cn("w-full", className)}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {existingItem ? "Add More" : "Add to Cart"}
      </Button>
    </>
  );
};

export default AddToCartButton;
