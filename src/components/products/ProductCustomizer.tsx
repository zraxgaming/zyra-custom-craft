
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
  const [isExpanded, setIsExpanded] = useState(false);
  
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
    <div className="space-y-6 p-6 border border-border rounded-lg bg-card/50 backdrop-blur-sm animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Customize Your Product</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="transition-all duration-300 hover:scale-105"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>

      <div className={`space-y-6 transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-none opacity-100' : 'max-h-96 opacity-90'} overflow-hidden`}>
        {customizationOptions.allowText && (
          <div className="space-y-3 animate-scale-in" style={{ animationDelay: '100ms' }}>
            <h4 className="text-sm font-medium flex items-center text-foreground transition-colors duration-200">
              <Type className="h-4 w-4 mr-2 text-primary" />
              Add Custom Text
            </h4>
            <Textarea
              placeholder="Enter your text here..."
              value={customization.text || ""}
              onChange={handleTextChange}
              maxLength={customizationOptions.maxTextLength}
              className="resize-none bg-background/80 text-foreground border-border transition-all duration-300 focus:shadow-lg focus:scale-[1.02] hover:border-primary/50"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {(customization.text?.length || 0)}/{customizationOptions.maxTextLength} characters
              </p>
              <div className={`w-full max-w-32 h-1 bg-muted rounded-full overflow-hidden transition-all duration-300`}>
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ 
                    width: `${((customization.text?.length || 0) / customizationOptions.maxTextLength) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}
        
        {customizationOptions.allowImage && (
          <div className="space-y-3 animate-scale-in" style={{ animationDelay: '200ms' }}>
            <h4 className="text-sm font-medium flex items-center text-foreground">
              <ImagePlus className="h-4 w-4 mr-2 text-primary" />
              Upload Image
            </h4>
            <div className="space-y-3">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-background/80 text-foreground border-border transition-all duration-300 file:transition-colors file:duration-200 hover:border-primary/50 focus:shadow-lg"
              />
              {customization.image && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg animate-fade-in">
                  <div className="relative group">
                    <img 
                      src={customization.image} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded border transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:bg-destructive hover:text-destructive-foreground"
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
          <div className="space-y-6 animate-scale-in" style={{ animationDelay: '300ms' }}>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Size</h4>
              <div className="px-2">
                <Slider
                  value={[customization.scale || 100]}
                  min={50}
                  max={200}
                  step={5}
                  onValueChange={handleScaleChange}
                  className="py-4 transition-all duration-200"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span className="transition-colors duration-200 hover:text-foreground">Small (50%)</span>
                  <span className="font-medium text-primary">{customization.scale || 100}%</span>
                  <span className="transition-colors duration-200 hover:text-foreground">Large (200%)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center text-foreground">
                <RotateCw className="h-4 w-4 mr-2 text-primary" />
                Rotation
              </h4>
              <div className="px-2">
                <Slider
                  value={[customization.rotation || 0]}
                  min={0}
                  max={360}
                  step={5}
                  onValueChange={handleRotationChange}
                  className="py-4 transition-all duration-200"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span className="transition-colors duration-200 hover:text-foreground">0°</span>
                  <span className="font-medium text-primary">{customization.rotation || 0}°</span>
                  <span className="transition-colors duration-200 hover:text-foreground">360°</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(customization.text || customization.image) && (
          <div className="pt-4 border-t border-border animate-fade-in">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              onClick={() => toast.success("Customization saved!")}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Customization
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCustomizer;
