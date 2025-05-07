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

interface CustomizationOptions {
  allowText: boolean;
  allowImage: boolean;
  maxTextLength: number;
  maxImageCount: number;
  allowResizeRotate: boolean;
}

interface CustomizationData {
  text?: string;
  image?: string;
  position?: { x: number; y: number };
  scale?: number;
  rotation?: number;
}

interface ProductCustomizerProps {
  productImage: string;
  customizationOptions: CustomizationOptions;
  onSave: (customization: CustomizationData) => void;
  onCancel: () => void;
  initialCustomization?: CustomizationData;
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  productImage,
  customizationOptions,
  onSave,
  onCancel,
  initialCustomization
}) => {
  const [customization, setCustomization] = useState<CustomizationData>(
    initialCustomization || {
      text: "",
      image: undefined,
      position: { x: 50, y: 50 }, // center by default
      scale: 100,
      rotation: 0
    }
  );
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (!customizationOptions.allowText) return;
    if (text.length > customizationOptions.maxTextLength) {
      toast.warning(`Text cannot exceed ${customizationOptions.maxTextLength} characters`);
      return;
    }
    
    setCustomization({ ...customization, text });
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
        setCustomization({ 
          ...customization, 
          image: event.target.result as string 
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleScaleChange = (value: number[]) => {
    if (!customizationOptions.allowResizeRotate) return;
    setCustomization({ ...customization, scale: value[0] });
  };
  
  const handleRotationChange = (value: number[]) => {
    if (!customizationOptions.allowResizeRotate) return;
    setCustomization({ ...customization, rotation: value[0] });
  };
  
  const handleDragStart = (e: React.MouseEvent) => {
    if (!customizationOptions.allowResizeRotate) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current || !customizationOptions.allowResizeRotate) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newX = Math.max(0, Math.min(100, (customization.position?.x || 50) + deltaX / rect.width * 100));
    const newY = Math.max(0, Math.min(100, (customization.position?.y || 50) + deltaY / rect.height * 100));
    
    setCustomization({
      ...customization,
      position: { x: newX, y: newY }
    });
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleSave = () => {
    onSave(customization);
  };
  
  const handleRemoveImage = () => {
    setCustomization({ ...customization, image: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleDragMove(e as unknown as React.MouseEvent);
      };
      
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="outline" className="flex items-center" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-lg font-medium">Customize Your Product</h2>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Design
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Canvas area */}
        <div className="flex-1 p-6 flex items-center justify-center bg-gray-50">
          <div 
            ref={canvasRef}
            className="relative w-full max-w-md aspect-square border rounded-lg shadow-sm overflow-hidden"
            style={{
              backgroundImage: `url(${productImage})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {customization.text && (
              <div
                className="absolute cursor-move"
                style={{
                  left: `${customization.position?.x || 50}%`,
                  top: `${customization.position?.y || 50}%`,
                  transform: `translate(-50%, -50%) scale(${(customization.scale || 100) / 100}) rotate(${customization.rotation || 0}deg)`,
                  transformOrigin: 'center',
                  userSelect: 'none'
                }}
                onMouseDown={handleDragStart}
              >
                <div className="bg-white bg-opacity-70 p-2 rounded text-center">
                  {customization.text}
                </div>
              </div>
            )}
            
            {customization.image && (
              <div
                className="absolute cursor-move"
                style={{
                  left: `${customization.position?.x || 50}%`,
                  top: `${customization.position?.y || 50}%`,
                  transform: `translate(-50%, -50%) scale(${(customization.scale || 100) / 100}) rotate(${customization.rotation || 0}deg)`,
                  transformOrigin: 'center',
                  userSelect: 'none'
                }}
                onMouseDown={handleDragStart}
              >
                <img 
                  src={customization.image} 
                  alt="User uploaded" 
                  className="max-w-[100px] max-h-[100px] object-contain"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Controls area */}
        <div className="w-full md:w-80 p-6 border-t md:border-t-0 md:border-l bg-white flex flex-col gap-6">
          {customizationOptions.allowText && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Type className="h-4 w-4 mr-2" />
                Add Custom Text
              </h3>
              <Textarea
                placeholder="Enter your text here..."
                value={customization.text || ""}
                onChange={handleTextChange}
                maxLength={customizationOptions.maxTextLength}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(customization.text?.length || 0)}/{customizationOptions.maxTextLength} characters
              </p>
            </div>
          )}
          
          {customizationOptions.allowImage && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <ImagePlus className="h-4 w-4 mr-2" />
                Upload Image
              </h3>
              <div className="flex flex-col gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {customization.image && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRemoveImage}
                    className="flex items-center gap-1 self-start"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {customizationOptions.allowResizeRotate && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <Slider
                  value={[customization.scale || 100]}
                  min={50}
                  max={200}
                  step={5}
                  onValueChange={handleScaleChange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotation
                </h3>
                <Slider
                  value={[customization.rotation || 0]}
                  min={0}
                  max={360}
                  step={5}
                  onValueChange={handleRotationChange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0°</span>
                  <span>360°</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;
