
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Palette, Type, Upload, Save, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [customization, setCustomization] = useState({
    text: "",
    textColor: "#000000",
    backgroundColor: "#ffffff",
    fontSize: "16",
    fontFamily: "Arial",
    imageUrl: "",
    position: "center",
    notes: ""
  });
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleSaveCustomization = () => {
    try {
      addToCart({
        id: product.id,
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.images?.[0] || "",
        quantity,
        customization,
        is_customized: true
      });

      toast({
        title: "Added to Cart!",
        description: "Your customized product has been added to cart.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customized product to cart.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Customize {product?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div 
              className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: customization.backgroundColor }}
            >
              {product?.images?.[0] && (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
              )}
              
              {customization.imageUrl && (
                <img 
                  src={customization.imageUrl} 
                  alt="Custom" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              
              {customization.text && (
                <div 
                  className={`absolute inset-0 flex items-center justify-center p-4 z-10 ${
                    customization.position === 'top' ? 'items-start pt-8' :
                    customization.position === 'bottom' ? 'items-end pb-8' :
                    'items-center'
                  }`}
                >
                  <span 
                    className="font-bold text-center shadow-lg"
                    style={{ 
                      color: customization.textColor,
                      fontSize: `${customization.fontSize}px`,
                      fontFamily: customization.fontFamily
                    }}
                  >
                    {customization.text}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Type className="h-5 w-5" />
                Text Customization
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="customText">Custom Text</Label>
                  <Textarea
                    id="customText"
                    placeholder="Enter your custom text..."
                    value={customization.text}
                    onChange={(e) => setCustomization(prev => ({ ...prev, text: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="textColor">Text Color</Label>
                    <Input
                      id="textColor"
                      type="color"
                      value={customization.textColor}
                      onChange={(e) => setCustomization(prev => ({ ...prev, textColor: e.target.value }))}
                      className="h-10 mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="backgroundColor">Background</Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={customization.backgroundColor}
                      onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="h-10 mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Input
                      id="fontSize"
                      type="number"
                      value={customization.fontSize}
                      onChange={(e) => setCustomization(prev => ({ ...prev, fontSize: e.target.value }))}
                      min="8"
                      max="72"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <select
                      id="fontFamily"
                      value={customization.fontFamily}
                      onChange={(e) => setCustomization(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md mt-1"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="position">Text Position</Label>
                  <select
                    id="position"
                    value={customization.position}
                    onChange={(e) => setCustomization(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md mt-1"
                  >
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Image Upload
              </h3>
              
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={customization.imageUrl}
                  onChange={(e) => setCustomization(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests or notes for customization..."
                  value={customization.notes}
                  onChange={(e) => setCustomization(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  max="10"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSaveCustomization}
                className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-8"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;
