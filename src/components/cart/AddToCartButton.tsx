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

  // Customization logic
  const [customization, setCustomization] = useState<any>({});
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Detect if product is customizable
  const isCustomizable = !!product.is_customizable;
  const existingItem = cart.find(item => item.product_id === product.id);

  // Helper: is customization present
  const hasCustomization = () =>
    customization && Object.keys(customization).length > 0;

  const handleAddToCart = () => {
    if (disabled) return;
    // Customizable check
    if (isCustomizable && !hasCustomization()) {
      setCustomModalOpen(true);
      toast({
        title: "Customization Required",
        description: "Please customize this product before adding to cart.",
        variant: "destructive"
      });
      return;
    }
    addToCart(
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
  };

  return (
    <>
      {/* Customization Modal could go here if needed */}
      {isCustomizable && customModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="font-semibold mb-2">Customize Your Product</h2>
            {/* Here you could render your <ProductCustomizer> or inputs */}
            <input
              type="text"
              placeholder="Enter custom text..."
              className="w-full border p-2 mb-2"
              onChange={e => setCustomization({ ...customization, text: e.target.value })}
            />
            <div className="flex gap-2 mt-2">
              <Button onClick={() => setCustomModalOpen(false)} variant="outline">Cancel</Button>
              <Button 
                onClick={() => {
                  setCustomModalOpen(false);
                  handleAddToCart();
                }}
                disabled={!hasCustomization()}
              >Add to Cart</Button>
            </div>
          </div>
        </div>
      )}
      <Button
        onClick={handleAddToCart}
        disabled={disabled}
        className={`w-full ${className}`}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {existingItem ? "Add More" : "Add to Cart"}
      </Button>
    </>
  );
};

export default AddToCartButton;
