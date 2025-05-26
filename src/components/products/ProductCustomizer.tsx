
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Type, Image } from "lucide-react";

interface ProductCustomizerProps {
  productId: string;
  children?: React.ReactNode;
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ productId, children }) => {
  const [customText, setCustomText] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCustomImage(file);
    }
  };

  const handleSaveCustomization = () => {
    console.log("Saving customization:", { productId, customText, customImage });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="outline">Customize</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Your Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customText" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Custom Text
            </Label>
            <Textarea
              id="customText"
              placeholder="Enter your custom text..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="customImage" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Custom Image
            </Label>
            <Input
              id="customImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1"
            />
          </div>
          
          <Button onClick={handleSaveCustomization} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Save Customization
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizer;
