
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Type, Image as ImageIcon, Palette, RotateCw, Move, Save } from "lucide-react";

interface CustomizationEditorProps {
  onSave: (customization: any) => void;
  allowText?: boolean;
  allowImage?: boolean;
  maxTextLength?: number;
}

const CustomizationEditor: React.FC<CustomizationEditorProps> = ({
  onSave,
  allowText = true,
  allowImage = true,
  maxTextLength = 100
}) => {
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState([16]);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [imageRotation, setImageRotation] = useState([0]);
  const [imageScale, setImageScale] = useState([100]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setCustomImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (allowText && !customText.trim() && allowImage && !customImage) {
      toast({
        title: "Add customization",
        description: "Please add some text or upload an image.",
        variant: "destructive"
      });
      return;
    }

    const customization = {
      text: allowText ? {
        content: customText,
        color: textColor,
        size: textSize[0],
        position: textPosition
      } : null,
      image: allowImage && customImage ? {
        file: customImage,
        position: imagePosition,
        rotation: imageRotation[0],
        scale: imageScale[0] / 100
      } : null,
      timestamp: Date.now()
    };

    // Convert image to base64 for storage
    if (customImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const customizationWithImage = {
          ...customization,
          image: {
            ...customization.image,
            base64: reader.result as string,
            file: undefined // Remove file object
          }
        };
        onSave(customizationWithImage);
      };
      reader.readAsDataURL(customImage);
    } else {
      onSave(customization);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Product Customization Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Area */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="relative w-full h-80 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              {/* Text Preview */}
              {allowText && customText && (
                <div
                  className="absolute pointer-events-none select-none"
                  style={{
                    left: `${textPosition.x}%`,
                    top: `${textPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    color: textColor,
                    fontSize: `${textSize[0]}px`,
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {customText}
                </div>
              )}
              
              {/* Image Preview */}
              {allowImage && imagePreview && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${imagePosition.x}%`,
                    top: `${imagePosition.y}%`,
                    transform: `translate(-50%, -50%) rotate(${imageRotation[0]}deg) scale(${imageScale[0] / 100})`,
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Custom"
                    className="max-w-24 max-h-24 object-contain"
                  />
                </div>
              )}
              
              {!customText && !imagePreview && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Palette className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Your customization will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <Tabs defaultValue={allowText ? "text" : "image"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                {allowText && (
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                )}
                {allowImage && (
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image
                  </TabsTrigger>
                )}
              </TabsList>

              {allowText && (
                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label htmlFor="customText">Custom Text</Label>
                    <Textarea
                      id="customText"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      maxLength={maxTextLength}
                      placeholder="Enter your custom text..."
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {customText.length}/{maxTextLength} characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id="textColor"
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Text Size: {textSize[0]}px</Label>
                    <Slider
                      value={textSize}
                      onValueChange={setTextSize}
                      max={48}
                      min={8}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Text Position</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <Label htmlFor="textX" className="text-xs">X: {textPosition.x}%</Label>
                        <Slider
                          value={[textPosition.x]}
                          onValueChange={(value) => setTextPosition(prev => ({ ...prev, x: value[0] }))}
                          max={100}
                          min={0}
                          step={1}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="textY" className="text-xs">Y: {textPosition.y}%</Label>
                        <Slider
                          value={[textPosition.y]}
                          onValueChange={(value) => setTextPosition(prev => ({ ...prev, y: value[0] }))}
                          max={100}
                          min={0}
                          step={1}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}

              {allowImage && (
                <TabsContent value="image" className="space-y-4">
                  <div>
                    <Label htmlFor="customImage">Upload Image</Label>
                    <div className="mt-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                    </div>
                    {imagePreview && (
                      <div className="mt-2 text-sm text-green-600">
                        ✓ Image uploaded successfully
                      </div>
                    )}
                  </div>

                  {imagePreview && (
                    <>
                      <div>
                        <Label>Image Position</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <Label className="text-xs">X: {imagePosition.x}%</Label>
                            <Slider
                              value={[imagePosition.x]}
                              onValueChange={(value) => setImagePosition(prev => ({ ...prev, x: value[0] }))}
                              max={100}
                              min={0}
                              step={1}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Y: {imagePosition.y}%</Label>
                            <Slider
                              value={[imagePosition.y]}
                              onValueChange={(value) => setImagePosition(prev => ({ ...prev, y: value[0] }))}
                              max={100}
                              min={0}
                              step={1}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Rotation: {imageRotation[0]}°</Label>
                        <Slider
                          value={imageRotation}
                          onValueChange={setImageRotation}
                          max={360}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>Scale: {imageScale[0]}%</Label>
                        <Slider
                          value={imageScale}
                          onValueChange={setImageScale}
                          max={200}
                          min={25}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                    </>
                  )}
                </TabsContent>
              )}
            </Tabs>

            <Button onClick={handleSave} className="w-full" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Customization
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizationEditor;
