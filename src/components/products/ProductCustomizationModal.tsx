
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Palette, Type, Image as ImageIcon, RotateCw, Move, Trash2 } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductWithImages } from "@/types/product";

interface CustomizationOption {
  id: string;
  allowText: boolean;
  allowImage: boolean;
  maxTextLength: number;
  maxImageCount: number;
  allowResizeRotate: boolean;
}

interface ProductCustomizationModalProps {
  product: ProductWithImages;
  customizationOptions?: CustomizationOption[];
  trigger?: React.ReactNode;
}

interface TextElement {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  x: number;
  y: number;
  rotation: number;
}

interface ImageElement {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
  product,
  customizationOptions = [],
  trigger
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [newText, setNewText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");

  const option = customizationOptions[0]; // Use first customization option

  const addTextElement = () => {
    if (!newText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text",
        variant: "destructive"
      });
      return;
    }

    if (option?.maxTextLength && newText.length > option.maxTextLength) {
      toast({
        title: "Text too long",
        description: `Text must be ${option.maxTextLength} characters or less`,
        variant: "destructive"
      });
      return;
    }

    const element: TextElement = {
      id: `text-${Date.now()}`,
      text: newText,
      color: textColor,
      fontSize,
      fontFamily,
      x: 50,
      y: 50,
      rotation: 0
    };

    setTextElements(prev => [...prev, element]);
    setNewText("");
    
    toast({
      title: "Text added!",
      description: "Your text has been added to the design",
    });
  };

  const addImageElement = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (option?.maxImageCount && imageElements.length >= option.maxImageCount) {
      toast({
        title: "Image limit reached",
        description: `You can only add ${option.maxImageCount} image(s)`,
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const element: ImageElement = {
        id: `image-${Date.now()}`,
        src: e.target?.result as string,
        x: 50,
        y: 100,
        width: 100,
        height: 100,
        rotation: 0
      };

      setImageElements(prev => [...prev, element]);
      
      toast({
        title: "Image added!",
        description: "Your image has been added to the design",
      });
    };
    reader.readAsDataURL(file);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const updateImageElement = (id: string, updates: Partial<ImageElement>) => {
    setImageElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    setTextElements(prev => prev.filter(el => el.id !== id));
    setImageElements(prev => prev.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const getCustomizationData = () => {
    return {
      textElements,
      imageElements,
      hasCustomization: textElements.length > 0 || imageElements.length > 0
    };
  };

  const selectedTextElement = textElements.find(el => el.id === selectedElement);
  const selectedImageElement = imageElements.find(el => el.id === selectedElement);

  const defaultTrigger = (
    <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
      <Palette className="h-4 w-4 mr-2" />
      Customize
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Customize {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden bg-muted/20">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              
              {/* Text Elements Overlay */}
              {textElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-pointer border-2 ${
                    selectedElement === element.id ? 'border-primary' : 'border-transparent'
                  }`}
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    transform: `rotate(${element.rotation}deg)`,
                    fontSize: `${element.fontSize}px`,
                    color: element.color,
                    fontFamily: element.fontFamily
                  }}
                  onClick={() => setSelectedElement(element.id)}
                >
                  {element.text}
                </div>
              ))}
              
              {/* Image Elements Overlay */}
              {imageElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-pointer border-2 ${
                    selectedElement === element.id ? 'border-primary' : 'border-transparent'
                  }`}
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    transform: `rotate(${element.rotation}deg)`,
                    width: `${element.width}px`,
                    height: `${element.height}px`
                  }}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <img
                    src={element.src}
                    alt="Custom"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Customization Controls */}
          <div className="space-y-4">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {option?.allowText && (
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                )}
                {option?.allowImage && (
                  <TabsTrigger value="images" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Images
                  </TabsTrigger>
                )}
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Edit
                </TabsTrigger>
              </TabsList>
              
              {option?.allowText && (
                <TabsContent value="text" className="space-y-4">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label htmlFor="newText">Add Text</Label>
                        <Textarea
                          id="newText"
                          value={newText}
                          onChange={(e) => setNewText(e.target.value)}
                          placeholder="Enter your text..."
                          maxLength={option?.maxTextLength}
                          className="mt-1"
                        />
                        {option?.maxTextLength && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {newText.length}/{option.maxTextLength} characters
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="textColor">Color</Label>
                          <Input
                            id="textColor"
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="mt-1 h-10"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fontSize">Size</Label>
                          <Input
                            id="fontSize"
                            type="number"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            min="12"
                            max="72"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="fontFamily">Font</Label>
                        <select
                          id="fontFamily"
                          value={fontFamily}
                          onChange={(e) => setFontFamily(e.target.value)}
                          className="w-full mt-1 p-2 border rounded-md"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Verdana">Verdana</option>
                        </select>
                      </div>
                      
                      <Button onClick={addTextElement} className="w-full">
                        Add Text
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {option?.allowImage && (
                <TabsContent value="images" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <Label htmlFor="imageUpload">Upload Image</Label>
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={addImageElement}
                        className="mt-1"
                      />
                      {option?.maxImageCount && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {imageElements.length}/{option.maxImageCount} images
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              <TabsContent value="edit" className="space-y-4">
                {selectedElement ? (
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Edit Selected Element</h4>
                        <Button
                          onClick={() => deleteElement(selectedElement)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {selectedTextElement && (
                        <div className="space-y-3">
                          <Badge variant="secondary">Text Element</Badge>
                          <div>
                            <Label>Text</Label>
                            <Input
                              value={selectedTextElement.text}
                              onChange={(e) => updateTextElement(selectedElement, { text: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>X Position (%)</Label>
                              <Input
                                type="number"
                                value={selectedTextElement.x}
                                onChange={(e) => updateTextElement(selectedElement, { x: Number(e.target.value) })}
                                min="0"
                                max="100"
                              />
                            </div>
                            <div>
                              <Label>Y Position (%)</Label>
                              <Input
                                type="number"
                                value={selectedTextElement.y}
                                onChange={(e) => updateTextElement(selectedElement, { y: Number(e.target.value) })}
                                min="0"
                                max="100"
                              />
                            </div>
                          </div>
                          {option?.allowResizeRotate && (
                            <div>
                              <Label>Rotation (degrees)</Label>
                              <Input
                                type="number"
                                value={selectedTextElement.rotation}
                                onChange={(e) => updateTextElement(selectedElement, { rotation: Number(e.target.value) })}
                                min="-180"
                                max="180"
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {selectedImageElement && (
                        <div className="space-y-3">
                          <Badge variant="secondary">Image Element</Badge>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>X Position (%)</Label>
                              <Input
                                type="number"
                                value={selectedImageElement.x}
                                onChange={(e) => updateImageElement(selectedElement, { x: Number(e.target.value) })}
                                min="0"
                                max="100"
                              />
                            </div>
                            <div>
                              <Label>Y Position (%)</Label>
                              <Input
                                type="number"
                                value={selectedImageElement.y}
                                onChange={(e) => updateImageElement(selectedElement, { y: Number(e.target.value) })}
                                min="0"
                                max="100"
                              />
                            </div>
                          </div>
                          {option?.allowResizeRotate && (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label>Width (px)</Label>
                                  <Input
                                    type="number"
                                    value={selectedImageElement.width}
                                    onChange={(e) => updateImageElement(selectedElement, { width: Number(e.target.value) })}
                                    min="10"
                                    max="300"
                                  />
                                </div>
                                <div>
                                  <Label>Height (px)</Label>
                                  <Input
                                    type="number"
                                    value={selectedImageElement.height}
                                    onChange={(e) => updateImageElement(selectedElement, { height: Number(e.target.value) })}
                                    min="10"
                                    max="300"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Rotation (degrees)</Label>
                                <Input
                                  type="number"
                                  value={selectedImageElement.rotation}
                                  onChange={(e) => updateImageElement(selectedElement, { rotation: Number(e.target.value) })}
                                  min="-180"
                                  max="180"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-muted-foreground">
                        Click on an element in the preview to edit it
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="pt-4 border-t">
              <AddToCartButton
                product={product}
                customization={getCustomizationData()}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizationModal;
