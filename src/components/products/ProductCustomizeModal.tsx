import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

type CustomizationOptions = {
  allow_text?: boolean;
  allow_image?: boolean;
  max_text_length?: number;
  max_image_count?: number;
};

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    is_digital?: boolean;
    digital_file_url?: string;
    customization_options?: CustomizationOptions;
    stock_quantity?: number;
  };
}

const ProductCustomizeModal: React.FC<Props> = ({ open, onOpenChange, product }) => {
  const opts = product.customization_options ?? {};
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [customText, setCustomText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasCustomization = opts.allow_text || opts.allow_image;
  const isDigital = !!product.is_digital;

  // Ensure not allowed unless customization actually provided (if required)
  const canAdd =
    (opts.allow_text ? customText.trim().length > 0 : true) &&
    (opts.allow_image ? !!selectedFile : true);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };

  const handleAddToCart = async () => {
    if (!canAdd) {
      toast({
        title: "Customization required",
        description: "Please provide the required customization.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    // For now, we only store image uploads as base64 for demo; in production, upload to storage bucket!
    let customization: any = {};
    if (opts.allow_text) customization.text = customText.trim();
    if (opts.allow_image && selectedFile) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        customization.image_base64 = evt.target?.result as string;
        await doAddToCart(customization);
      };
      reader.readAsDataURL(selectedFile);
      return;
    }
    await doAddToCart(customization);
  };

  const doAddToCart = async (customization: any) => {
    await addToCart(
      {
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.images[0] || "/placeholder-product.jpg",
        is_digital: product.is_digital,
        digital_file_url: product.digital_file_url
      },
      quantity,
      customization
    );
    toast({
      title: "Added to cart",
      description: (
        <span>
          {quantity} {product.name} added to your cart
        </span>
      ),
    });
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {product.is_digital ? "Purchase Digital Product" : "Customize Product"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {opts.allow_text && (
            <div>
              <Label htmlFor="customText">Custom Text</Label>
              <Textarea
                id="customText"
                placeholder="Enter your custom text..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={opts.max_text_length ?? 100}
              />
              <p className="text-xs text-muted-foreground">{customText.length}/{opts.max_text_length ?? 100} characters</p>
            </div>
          )}
          {opts.allow_image && (
            <div>
              <Label htmlFor="customImage">Upload an Image</Label>
              <Input
                id="customImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-32 mt-2 rounded shadow" />
              )}
            </div>
          )}
          {!opts.allow_text && !opts.allow_image && !product.is_digital && (
            <div className="text-muted-foreground text-sm">No customization required for this product.</div>
          )}
          <div className="flex items-center gap-4">
            <Label>Qty</Label>
            <Input
              type="number"
              min={1}
              max={product.stock_quantity ?? 99}
              value={quantity}
              className="w-16"
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={!canAdd || loading}
            className="bg-primary text-white flex gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.is_digital ? "Purchase" : "Add to Cart"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizeModal;
