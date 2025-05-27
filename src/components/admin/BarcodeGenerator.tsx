
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Plus } from "lucide-react";
import EnhancedProductSearch from "./EnhancedProductSearch";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

const BarcodeGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customData, setCustomData] = useState("");
  const [barcodeType, setBarcodeType] = useState("qr");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!selectedProduct && !customData) {
      toast({
        title: "Missing data",
        description: "Please select a product or enter custom data.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      let barcodeData = customData;
      
      if (selectedProduct && !barcodeData) {
        barcodeData = selectedProduct.sku || selectedProduct.name || selectedProduct.id;
      }

      const { error } = await supabase
        .from("barcode_generations")
        .insert({
          barcode_type: barcodeType,
          barcode_data: barcodeData,
          product_id: selectedProduct?.id || null,
          generated_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Barcode generated",
        description: "Barcode has been generated successfully.",
      });

      // Reset form
      setSelectedProduct(null);
      setCustomData("");
      setBarcodeType("qr");

      // Refresh the page to show new barcode
      window.location.reload();
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

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          Generate New Barcode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="barcodeType">Barcode Type</Label>
            <Select value={barcodeType} onValueChange={setBarcodeType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qr">QR Code</SelectItem>
                <SelectItem value="code128">Code 128</SelectItem>
                <SelectItem value="ean13">EAN-13</SelectItem>
                <SelectItem value="upc">UPC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customData">Custom Data (Optional)</Label>
            <Input
              id="customData"
              value={customData}
              onChange={(e) => setCustomData(e.target.value)}
              placeholder="Enter custom barcode data"
            />
          </div>
        </div>

        <EnhancedProductSearch
          onProductSelect={setSelectedProduct}
          selectedProduct={selectedProduct}
          label="Product (Optional)"
          placeholder="Search for a product to generate barcode..."
        />

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="w-full"
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
      </CardContent>
    </Card>
  );
};

export default BarcodeGenerator;
