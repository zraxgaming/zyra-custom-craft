
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QrCode, Download } from 'lucide-react';
import ProductSearchSelect from './ProductSearchSelect';

const BarcodeGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBarcode, setGeneratedBarcode] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    barcodeType: "qr",
    selectedProduct: null as any,
    customData: "",
  });

  const handleGenerate = async () => {
    if (!formData.selectedProduct && !formData.customData) {
      toast({
        title: "Missing data",
        description: "Please select a product or enter custom data.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      let barcodeData = formData.customData;
      
      if (formData.selectedProduct && !barcodeData) {
        barcodeData = formData.selectedProduct.sku || formData.selectedProduct.name || formData.selectedProduct.id;
      }

      const { data, error } = await supabase
        .from("barcode_generations")
        .insert({
          barcode_type: formData.barcodeType,
          barcode_data: barcodeData,
          product_id: formData.selectedProduct?.id || null,
        })
        .select()
        .single();

      if (error) throw error;

      setGeneratedBarcode(data);
      
      toast({
        title: "Barcode generated",
        description: "Barcode has been generated successfully.",
      });

    } catch (error: any) {
      toast({
        title: "Error generating barcode",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadBarcode = () => {
    if (!generatedBarcode) return;
    
    // Create a canvas element to generate the barcode
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 300;
    canvas.height = 150;
    
    // Draw a simple barcode representation
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(generatedBarcode.barcode_data, canvas.width / 2, canvas.height / 2);
    
    // Download the image
    const link = document.createElement('a');
    link.download = `barcode-${generatedBarcode.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast({
      title: "Downloaded",
      description: "Barcode image has been downloaded.",
    });
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <QrCode className="h-6 w-6 text-primary" />
          Generate Barcode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="barcodeType">Barcode Type</Label>
              <Select value={formData.barcodeType} onValueChange={(value) => setFormData({...formData, barcodeType: value})}>
                <SelectTrigger className="animate-fade-in">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="animate-scale-in">
                  <SelectItem value="qr">QR Code</SelectItem>
                  <SelectItem value="code128">Code 128</SelectItem>
                  <SelectItem value="ean13">EAN-13</SelectItem>
                  <SelectItem value="upc">UPC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ProductSearchSelect
              onProductSelect={(product) => setFormData({...formData, selectedProduct: product})}
              selectedProduct={formData.selectedProduct}
              placeholder="Search for a product..."
            />

            <div>
              <Label htmlFor="customData">Custom Data (Optional)</Label>
              <Input
                id="customData"
                value={formData.customData}
                onChange={(e) => setFormData({...formData, customData: e.target.value})}
                placeholder="Enter custom barcode data"
                className="animate-fade-in"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full hover:scale-105 transition-transform"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate Barcode
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {generatedBarcode ? (
              <Card className="bg-primary/5 border-primary/20 animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-sm">Generated Barcode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-white rounded border">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-600" />
                    </div>
                    <p className="mt-2 text-sm font-mono">{generatedBarcode.barcode_data}</p>
                    <p className="text-xs text-muted-foreground">
                      {generatedBarcode.barcode_type.toUpperCase()}
                    </p>
                  </div>
                  <Button 
                    onClick={downloadBarcode} 
                    variant="outline" 
                    className="w-full hover:scale-105 transition-transform"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-muted/50 animate-fade-in">
                <CardContent className="p-8 text-center">
                  <QrCode className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Generated barcode will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeGenerator;
