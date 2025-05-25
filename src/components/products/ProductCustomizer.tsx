
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  RotateCw, 
  Type, 
  ImagePlus, 
  ArrowLeft, 
  Trash2, 
  Save
} from "lucide-react";
import { toast } from "sonner";
import { CustomizationOptions } from "@/types/product";

interface CustomizationData {
  text?: string;
  image?: string;
  position?: { x: number; y: number };
  scale?: number;
  rotation?: number;
}

interface ProductCustomizerProps {
  productId: string;
  customizationOptions: CustomizationOptions;
  customization: CustomizationData;
  onCustomizationChange: (customization: CustomizationData) => void;
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  productId,
  customizationOptions,
  customization,
  onCustomizationChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (!customizationOptions.allowText) return;
    if (text.length > customizationOptions.maxTextLength) {
      toast.warning(`Text cannot exceed ${customizationOptions.maxTextLength} characters`);
      return;
    }
    
    onCustomizationChange({ ...customization, text });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!customizationOptions.allowImage) return;
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onCustomizationChange({ 
          ...customization, 
          image: event.target.result as string 
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleScaleChange = (value: number[]) => {
    if (!customizationOptions.allowResizeRotate) return;
    onCustomizationChange({ ...customization, scale: value[0] });
  };
  
  const handleRotationChange = (value: number[]) => {
    if (!customizationOptions.allowResizeRotate) return;
    onCustomizationChange({ ...customization, rotation: value[0] });
  };
  
  const handleRemoveImage = () => {
    onCustomizationChange({ ...customization, image: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-4">
      {customizationOptions.allowText && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center text-foreground">
            <Type className="h-4 w-4 mr-2" />
            Add Custom Text
          </h4>
          <Textarea
            placeholder="Enter your text here..."
            value={customization.text || ""}
            onChange={handleTextChange}
            maxLength={customizationOptions.maxTextLength}
            className="resize-none bg-background text-foreground border-border"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {(customization.text?.length || 0)}/{customizationOptions.maxTextLength} characters
          </p>
        </div>
      )}
      
      {customizationOptions.allowImage && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center text-foreground">
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload Image
          </h4>
          <div className="flex flex-col gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-background text-foreground border-border"
            />
            {customization.image && (
              <div className="flex items-center gap-2">
                <img 
                  src={customization.image} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded border"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemoveImage}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {customizationOptions.allowResizeRotate && (customization.text || customization.image) && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-foreground">Size</h4>
            <Slider
              value={[customization.scale || 100]}
              min={50}
              max={200}
              step={5}
              onValueChange={handleScaleChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center text-foreground">
              <RotateCw className="h-4 w-4 mr-2" />
              Rotation
            </h4>
            <Slider
              value={[customization.rotation || 0]}
              min={0}
              max={360}
              step={5}
              onValueChange={handleRotationChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0°</span>
              <span>360°</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCustomizer;
