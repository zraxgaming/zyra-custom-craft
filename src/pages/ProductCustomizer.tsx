
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Palette, Type, Image as ImageIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";

const ProductCustomizer = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [customization, setCustomization] = useState({
    text: "",
    textColor: "#000000",
    backgroundColor: "#ffffff",
    image: "",
    position: "center"
  });

  const handleSave = async () => {
    try {
      // Simulate saving customization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Customization saved",
        description: "Your product has been customized successfully!",
      });
      
      navigate(`/products/${productId}`);
    } catch (error) {
      toast({
        title: "Error saving customization",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEOHead 
        title="Customize Your Product - Zyra"
        description="Personalize your product with custom text, colors, and images using our advanced customization tools."
        url={`https://shopzyra.vercel.app/customize/${productId}`}
      />
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="customize-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" rx="10"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
                <path d="M40,40 L60,60 M60,40 L40,60" stroke="currentColor" strokeWidth="0.2" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#customize-pattern)"/>
          </svg>
        </div>

        <Container className="py-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 animate-fade-in">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="border-border hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Customize Your Product
                </h1>
                <p className="text-muted-foreground">Make it uniquely yours</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Preview */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: customization.backgroundColor }}
                  >
                    {customization.image && (
                      <img 
                        src={customization.image} 
                        alt="Custom" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    {customization.text && (
                      <div 
                        className={`absolute inset-0 flex items-center justify-center p-4 ${
                          customization.position === 'top' ? 'items-start pt-8' :
                          customization.position === 'bottom' ? 'items-end pb-8' :
                          'items-center'
                        }`}
                      >
                        <span 
                          className="font-bold text-lg text-center"
                          style={{ color: customization.textColor }}
                        >
                          {customization.text}
                        </span>
                      </div>
                    )}
                    {!customization.text && !customization.image && (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Your customization will appear here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Customization Options */}
              <div className="space-y-6 animate-slide-in-right">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Text Customization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customText">Custom Text</Label>
                      <Textarea
                        id="customText"
                        placeholder="Enter your custom text..."
                        value={customization.text}
                        onChange={(e) => setCustomization(prev => ({ ...prev, text: e.target.value }))}
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="textColor">Text Color</Label>
                        <Input
                          id="textColor"
                          type="color"
                          value={customization.textColor}
                          onChange={(e) => setCustomization(prev => ({ ...prev, textColor: e.target.value }))}
                          className="h-10 bg-background/50 border-border/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={customization.backgroundColor}
                          onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="h-10 bg-background/50 border-border/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Text Position</Label>
                      <select
                        id="position"
                        value={customization.position}
                        onChange={(e) => setCustomization(prev => ({ ...prev, position: e.target.value }))}
                        className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-md"
                      >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Image Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        value={customization.image}
                        onChange={(e) => setCustomization(prev => ({ ...prev, image: e.target.value }))}
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleSave}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 group"
                >
                  <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Save Customization
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ProductCustomizer;
