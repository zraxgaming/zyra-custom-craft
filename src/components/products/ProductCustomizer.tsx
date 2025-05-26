
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
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";

interface ProductCustomizerProps {
  productId: string;
  children: React.ReactNode;
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ productId, children }) => {
  const [open, setOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customColor, setCustomColor] = useState("#000000");
  const { toast } = useToast();

  const handleCustomization = () => {
    const customization = {
      text: customText,
      color: customColor,
    };

    toast({
      title: "Customization saved",
      description: "Your customization options have been saved",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Your Product</DialogTitle>
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
            <p className="text-xs text-muted-foreground mt-1">
              {customText.length}/100 characters
            </p>
          </div>

          <div>
            <Label htmlFor="customColor">Text Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="customColor"
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-16 h-10"
              />
              <span className="text-sm text-muted-foreground">{customColor}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCustomization}>
              Save Customization
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizer;
