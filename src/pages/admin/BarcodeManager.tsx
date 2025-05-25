
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { QrCode, Barcode, Download, Plus } from "lucide-react";
import QRGenerator from "@/components/barcode/QRGenerator";
import BarcodeGenerator from "@/components/barcode/BarcodeGenerator";

interface BarcodeGeneration {
  id: string;
  barcode_type: string;
  barcode_data: string;
  created_at: string;
  product_id?: string;
  products?: {
    name: string;
    sku: string;
  };
}

const BarcodeManager = () => {
  const [generations, setGenerations] = useState<BarcodeGeneration[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    barcodeType: "qr",
    productId: "",
    customData: "",
  });

  useEffect(() => {
    fetchGenerations();
    fetchProducts();
  }, []);

  const fetchGenerations = async () => {
    try {
      const { data, error } = await supabase
        .from("barcode_generations")
        .select(`
          *,
          products (
            name,
            sku
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGenerations(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching barcodes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku")
        .eq("status", "published")
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
    }
  };

  const handleGenerate = async () => {
    if (!formData.productId && !formData.customData) {
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
      
      if (formData.productId && !barcodeData) {
        const selectedProduct = products.find(p => p.id === formData.productId);
        barcodeData = selectedProduct?.sku || selectedProduct?.name || formData.productId;
      }

      const { error } = await supabase
        .from("barcode_generations")
        .insert({
          barcode_type: formData.barcodeType,
          barcode_data: barcodeData,
          product_id: formData.productId || null,
        });

      if (error) throw error;

      toast({
        title: "Barcode generated",
        description: "Barcode has been generated successfully.",
      });

      setFormData({
        barcodeType: "qr",
        productId: "",
        customData: "",
      });

      fetchGenerations();
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

  const downloadBarcode = (generation: BarcodeGeneration) => {
    // Create a temporary canvas to generate the barcode
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (generation.barcode_type === 'qr') {
      // For QR codes, we'll create a simple download
      const link = document.createElement('a');
      link.download = `qr-code-${generation.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else {
      // For regular barcodes
      const link = document.createElement('a');
      link.download = `barcode-${generation.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Barcode Manager</h1>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Plus className="mr-2 h-5 w-5" />
              Generate New Barcode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="barcodeType" className="text-foreground">Barcode Type</Label>
                <Select value={formData.barcodeType} onValueChange={(value) => setFormData({...formData, barcodeType: value})}>
                  <SelectTrigger className="bg-background text-foreground border-border">
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
                <Label htmlFor="productId" className="text-foreground">Product (Optional)</Label>
                <Select value={formData.productId} onValueChange={(value) => setFormData({...formData, productId: value})}>
                  <SelectTrigger className="bg-background text-foreground border-border">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} {product.sku && `(${product.sku})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customData" className="text-foreground">Custom Data</Label>
                <Input
                  id="customData"
                  value={formData.customData}
                  onChange={(e) => setFormData({...formData, customData: e.target.value})}
                  placeholder="Enter custom barcode data"
                  className="bg-background text-foreground border-border"
                />
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="bg-primary text-primary-foreground"
            >
              {isGenerating ? "Generating..." : "Generate Barcode"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Generated Barcodes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-foreground">Type</TableHead>
                    <TableHead className="text-foreground">Data</TableHead>
                    <TableHead className="text-foreground">Product</TableHead>
                    <TableHead className="text-foreground">Preview</TableHead>
                    <TableHead className="text-foreground">Created</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generations.map((generation) => (
                    <TableRow key={generation.id} className="border-border">
                      <TableCell className="text-foreground">
                        <div className="flex items-center">
                          {generation.barcode_type === 'qr' ? (
                            <QrCode className="h-4 w-4 mr-2" />
                          ) : (
                            <Barcode className="h-4 w-4 mr-2" />
                          )}
                          {generation.barcode_type.toUpperCase()}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground max-w-xs truncate">
                        {generation.barcode_data}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {generation.products?.name || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center w-20 h-12 bg-white rounded border">
                          {generation.barcode_type === 'qr' ? (
                            <QRGenerator 
                              value={generation.barcode_data || "sample"} 
                              size={40} 
                              className="scale-50" 
                            />
                          ) : (
                            <BarcodeGenerator 
                              value={generation.barcode_data || "sample"} 
                              format={generation.barcode_type.toUpperCase()}
                              width={1}
                              height={30}
                              className="scale-50"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {new Date(generation.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadBarcode(generation)}
                          className="text-foreground border-border"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BarcodeManager;
