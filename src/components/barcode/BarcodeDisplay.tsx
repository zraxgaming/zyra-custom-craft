
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, RefreshCw } from "lucide-react";
import BarcodeGenerator from "./BarcodeGenerator";
import QRGenerator from "./QRGenerator";

interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
}

const BarcodeDisplay = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [barcodeType, setBarcodeType] = useState<"barcode" | "qr">("qr");
  const [customData, setCustomData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, price')
        .eq('status', 'published')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateBarcodeData = (product: Product) => {
    if (customData) return customData;
    
    return JSON.stringify({
      id: product.id,
      name: product.name,
      sku: product.sku || product.id,
      price: product.price,
      url: `${window.location.origin}/products/${product.id}`
    });
  };

  const saveBarcodeGeneration = async (product: Product, type: string, data: string) => {
    try {
      const { error } = await supabase
        .from('barcode_generations')
        .insert({
          product_id: product.id,
          barcode_type: type,
          barcode_data: data,
          generated_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error saving barcode generation:", error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedProduct) {
      toast({
        title: "Please select a product",
        description: "You need to select a product to generate a barcode.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const data = generateBarcodeData(selectedProduct);
    
    try {
      await saveBarcodeGeneration(selectedProduct, barcodeType, data);
      toast({
        title: "Barcode generated",
        description: `${barcodeType.toUpperCase()} code generated successfully.`,
      });
    } catch (error) {
      console.error("Error generating barcode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBarcode = () => {
    const canvas = document.querySelector('canvas');
    const svg = document.querySelector('svg');
    
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${selectedProduct?.name || 'barcode'}-${barcodeType}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.download = `${selectedProduct?.name || 'qrcode'}-${barcodeType}.svg`;
      link.href = svgUrl;
      link.click();
      URL.revokeObjectURL(svgUrl);
    }
  };

  const barcodeData = selectedProduct ? generateBarcodeData(selectedProduct) : "";

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Barcode & QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="product-select" className="text-foreground">Select Product</Label>
            <Select onValueChange={(value) => {
              const product = products.find(p => p.id === value);
              setSelectedProduct(product || null);
            }}>
              <SelectTrigger className="bg-background text-foreground border-border">
                <SelectValue placeholder="Choose a product..." />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} {product.sku && `(${product.sku})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="barcode-type" className="text-foreground">Code Type</Label>
            <Select value={barcodeType} onValueChange={(value: "barcode" | "qr") => setBarcodeType(value)}>
              <SelectTrigger className="bg-background text-foreground border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="qr">QR Code</SelectItem>
                <SelectItem value="barcode">Barcode</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="custom-data" className="text-foreground">Custom Data (Optional)</Label>
          <Input
            id="custom-data"
            value={customData}
            onChange={(e) => setCustomData(e.target.value)}
            placeholder="Leave empty to use product data..."
            className="bg-background text-foreground border-border"
          />
        </div>

        {selectedProduct && (
          <div className="border border-border rounded-lg p-4 bg-background">
            <h4 className="font-medium text-foreground mb-2">Preview Data:</h4>
            <pre className="text-xs text-muted-foreground bg-muted p-2 rounded overflow-auto">
              {barcodeData}
            </pre>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleGenerate} 
            disabled={!selectedProduct || isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            Generate {barcodeType.toUpperCase()}
          </Button>
          
          {selectedProduct && (
            <Button 
              variant="outline" 
              onClick={downloadBarcode}
              className="text-foreground border-border hover:bg-muted"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>

        {selectedProduct && (
          <div className="flex justify-center p-6 bg-white rounded-lg border border-border">
            {barcodeType === "qr" ? (
              <QRGenerator 
                value={barcodeData}
                size={200}
              />
            ) : (
              <BarcodeGenerator 
                value={selectedProduct.sku || selectedProduct.id}
                width={2}
                height={100}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BarcodeDisplay;
