
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Type, Palette, RotateCw } from 'lucide-react';

interface CustomizationOptions {
  allowText?: boolean;
  allowImage?: boolean;
  maxTextLength?: number;
  maxImageCount?: number;
  allowResizeRotate?: boolean;
}

interface ProductCustomizerProps {
  productId: string;
  customizationOptions: CustomizationOptions;
  customization: Record<string, any>;
  onCustomizationChange: (customization: Record<string, any>) => void;
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  productId,
  customizationOptions,
  customization,
  onCustomizationChange,
}) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleTextChange = (field: string, value: string) => {
    onCustomizationChange({
      ...customization,
      [field]: value,
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + uploadedImages.length > (customizationOptions.maxImageCount || 1)) {
      alert(`Maximum ${customizationOptions.maxImageCount || 1} images allowed`);
      return;
    }
    
    setUploadedImages(prev => [...prev, ...files]);
    onCustomizationChange({
      ...customization,
      images: [...uploadedImages, ...files],
    });
  };

  const handleColorChange = (color: string) => {
    onCustomizationChange({
      ...customization,
      color,
    });
  };

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Customize Your Product
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {customizationOptions.allowText && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <Label htmlFor="custom-text">Custom Text</Label>
              <Badge variant="secondary" className="text-xs">
                Max {customizationOptions.maxTextLength || 100} chars
              </Badge>
            </div>
            <Textarea
              id="custom-text"
              placeholder="Enter your custom text..."
              value={customization.text || ''}
              onChange={(e) => handleTextChange('text', e.target.value)}
              maxLength={customizationOptions.maxTextLength || 100}
              className="transition-all duration-300 focus:scale-[1.02]"
            />
            <div className="text-xs text-muted-foreground text-right">
              {(customization.text || '').length} / {customizationOptions.maxTextLength || 100}
            </div>
          </div>
        )}

        {customizationOptions.allowImage && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <Label htmlFor="custom-image">Upload Images</Label>
              <Badge variant="secondary" className="text-xs">
                Max {customizationOptions.maxImageCount || 1} images
              </Badge>
            </div>
            <Input
              id="custom-image"
              type="file"
              accept="image/*"
              multiple={customizationOptions.maxImageCount > 1}
              onChange={handleImageUpload}
              className="transition-all duration-300 focus:scale-[1.02]"
            />
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border animate-scale-in"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <Label>Choose Color</Label>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                  customization.color === color
                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                    : 'border-border hover:border-primary'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {customizationOptions.allowResizeRotate && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RotateCw className="h-4 w-4" />
              <Label>Transform Options</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rotation" className="text-sm">Rotation</Label>
                <Input
                  id="rotation"
                  type="range"
                  min="0"
                  max="360"
                  value={customization.rotation || 0}
                  onChange={(e) => handleTextChange('rotation', e.target.value)}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {customization.rotation || 0}°
                </div>
              </div>
              <div>
                <Label htmlFor="scale" className="text-sm">Scale</Label>
                <Input
                  id="scale"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={customization.scale || 1}
                  onChange={(e) => handleTextChange('scale', e.target.value)}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {customization.scale || 1}x
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Preview Summary</h4>
          <div className="space-y-2 text-sm">
            {customization.text && (
              <div>Text: <span className="font-medium">"{customization.text}"</span></div>
            )}
            {customization.color && (
              <div className="flex items-center gap-2">
                Color: 
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: customization.color }}
                />
                <span className="font-medium">{customization.color}</span>
              </div>
            )}
            {uploadedImages.length > 0 && (
              <div>Images: <span className="font-medium">{uploadedImages.length} uploaded</span></div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCustomizer;
