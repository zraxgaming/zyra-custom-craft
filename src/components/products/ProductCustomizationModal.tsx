
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface ProductCustomizationModalProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
  children: React.ReactNode;
}

const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({ 
  product, 
  children 
}) => {
  const [open, setOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customColor, setCustomColor] = useState("#000000");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize {product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customText">Custom Text</Label>
            <Textarea
              id="customText"
              placeholder="Enter your custom text..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="customColor">Text Color</Label>
            <Input
              id="customColor"
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-16 h-10"
            />
          </div>

          <AddToCartButton
            product={product}
            className="w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizationModal;
