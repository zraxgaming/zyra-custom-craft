
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
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Palette, Type, Upload, RotateCw } from "lucide-react";

interface ProductCustomizationModalProps {
  product: Product;
  trigger: React.ReactNode;
}

export const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
  product,
  trigger,
}) => {
  const [customization, setCustomization] = useState<any>({});
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Customize {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 animate-fade-in">
          {/* Product Preview */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {Array.isArray(product.images) && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
            </div>
            <div className="w-full sm:w-1/2 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                <p className="text-2xl font-bold text-primary">${product.price}</p>
                {product.description && (
                  <p className="text-muted-foreground mt-2">{product.description}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-foreground">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 bg-background border-border focus:border-primary transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Customization Options */}
          {product.is_customizable && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Customization Options
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Text Customization */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border transition-all duration-200 hover:bg-muted/50">
                  <Label className="text-foreground flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Add Text
                  </Label>
                  <Textarea
                    placeholder="Enter your custom text..."
                    value={customization.text || ""}
                    onChange={(e) => handleCustomizationChange("text", e.target.value)}
                    className="bg-background border-border focus:border-primary transition-all duration-200"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={customization.textColor || "#000000"}
                      onChange={(e) => handleCustomizationChange("textColor", e.target.value)}
                      className="w-20 h-8 p-1 bg-background border-border"
                    />
                    <Badge variant="outline" className="transition-all duration-200 hover:bg-muted">
                      Text Color
                    </Badge>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border transition-all duration-200 hover:bg-muted/50">
                  <Label className="text-foreground flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          handleCustomizationChange("image", e.target?.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="bg-background border-border focus:border-primary transition-all duration-200"
                  />
                  {customization.image && (
                    <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={customization.image}
                        alt="Custom"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Position & Rotation */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border transition-all duration-200 hover:bg-muted/50">
                  <Label className="text-foreground flex items-center gap-2">
                    <RotateCw className="w-4 h-4" />
                    Position & Rotation
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">X Position</Label>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={customization.positionX || 50}
                        onChange={(e) => handleCustomizationChange("positionX", e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Y Position</Label>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={customization.positionY || 50}
                        onChange={(e) => handleCustomizationChange("positionY", e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Rotation (degrees)</Label>
                    <Input
                      type="range"
                      min="0"
                      max="360"
                      value={customization.rotation || 0}
                      onChange={(e) => handleCustomizationChange("rotation", e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                {/* Size Control */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border transition-all duration-200 hover:bg-muted/50">
                  <Label className="text-foreground">Size</Label>
                  <Input
                    type="range"
                    min="10"
                    max="200"
                    value={customization.size || 100}
                    onChange={(e) => handleCustomizationChange("size", e.target.value)}
                    className="bg-background"
                  />
                  <Badge variant="outline" className="transition-all duration-200 hover:bg-muted">
                    {customization.size || 100}%
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="transition-all duration-200 hover:bg-muted"
            >
              Cancel
            </Button>
            <AddToCartButton
              product={product}
              quantity={quantity}
              customization={customization}
              className="flex-1"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
