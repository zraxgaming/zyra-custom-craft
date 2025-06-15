import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Barcode, Download } from "lucide-react";
import ProductSearchSelect from "./ProductSearchSelect";

interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  images?: string[];
}

interface BarcodeGeneratorProps {
  onGenerated?: () => void;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ onGenerated }) => {
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
      if (selectedProduct && barcodeData) {
        await supabase
          .from('products')
          .update({ barcode: barcodeData })
          .eq('id', selectedProduct.id);
      }
      const { error } = await supabase
        .from("barcode_generations")
        .insert({
          barcode_type: barcodeType,
          barcode_data: barcodeData,
          product_id: selectedProduct?.id || null,
        });
      if (error) throw error;
      toast({
        title: "Barcode generated",
        description: "Barcode has been generated successfully.",
      });
      if (onGenerated) onGenerated();
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Generate Barcode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Barcode Type</Label>
          <Select value={barcodeType} onValueChange={setBarcodeType}>
            <SelectTrigger>
              <SelectValue />
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
          <Label>Product (Optional, will also set barcode)</Label>
          <ProductSearchSelect
            selectedProduct={selectedProduct}
            onProductSelect={setSelectedProduct}
            placeholder="Search for a product..."
          />
        </div>

        <div>
          <Label htmlFor="customData">Custom Data</Label>
          <Input
            id="customData"
            value={customData}
            onChange={(e) => setCustomData(e.target.value)}
            placeholder="Enter custom barcode data"
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? "Generating..." : "Generate Barcode"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BarcodeGenerator;
