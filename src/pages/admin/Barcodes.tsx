
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { QrCode, Download, Plus, Package } from "lucide-react";
import { format } from "date-fns";

interface BarcodeGeneration {
  id: string;
  product_id: string;
  barcode_type: string;
  barcode_data: string;
  created_at: string;
  generated_by: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
}

const Barcodes = () => {
  const [barcodes, setBarcodes] = useState<BarcodeGeneration[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [barcodeType, setBarcodeType] = useState("qr");
  const [customData, setCustomData] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchBarcodes();
    fetchProducts();
  }, []);

  const fetchBarcodes = async () => {
    try {
      const { data, error } = await supabase
        .from("barcode_generations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBarcodes(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching barcodes",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku, barcode")
        .eq("status", "published");

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateBarcode = async () => {
    if (!selectedProduct && !customData) {
      toast({
        title: "Missing data",
        description: "Please select a product or enter custom data.",
        variant: "destructive",
      });
      return;
    }

    try {
      const product = products.find(p => p.id === selectedProduct);
      const barcodeData = customData || product?.sku || product?.name || selectedProduct;

      const { error } = await supabase
        .from("barcode_generations")
        .insert({
          product_id: selectedProduct || null,
          barcode_type: barcodeType,
          barcode_data: barcodeData,
        });

      if (error) throw error;

      toast({
        title: "Barcode generated",
        description: "Barcode has been generated successfully.",
      });

      fetchBarcodes();
      setSelectedProduct("");
      setCustomData("");
    } catch (error: any) {
      toast({
        title: "Error generating barcode",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadBarcode = (barcodeId: string, data: string) => {
    // Generate QR code data URL
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;
    
    // Simple QR code placeholder - in production, use a proper QR code library
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    ctx.fillText(data, 10, 100);

    const link = document.createElement('a');
    link.download = `barcode-${barcodeId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Barcode Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <QrCode className="mr-2 h-5 w-5" />
                Total Barcodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{barcodes.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Products with Barcodes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {products.filter(p => p.barcode).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Generated Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {barcodes.filter(b => 
                  new Date(b.created_at).toDateString() === new Date().toDateString()
                ).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Generate New Barcode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="product" className="text-foreground">Select Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="bg-background text-foreground border-border">
                    <SelectValue placeholder="Select a product" />
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
                <Label htmlFor="type" className="text-foreground">Barcode Type</Label>
                <Select value={barcodeType} onValueChange={setBarcodeType}>
                  <SelectTrigger className="bg-background text-foreground border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qr">QR Code</SelectItem>
                    <SelectItem value="ean13">EAN-13</SelectItem>
                    <SelectItem value="code128">Code 128</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="custom" className="text-foreground">Custom Data (Optional)</Label>
                <Input
                  id="custom"
                  value={customData}
                  onChange={(e) => setCustomData(e.target.value)}
                  placeholder="Enter custom data"
                  className="bg-background text-foreground border-border"
                />
              </div>
            </div>

            <Button onClick={generateBarcode} className="bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Generate Barcode
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
                    <TableHead className="text-foreground">Generated</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barcodes.map((barcode) => {
                    const product = products.find(p => p.id === barcode.product_id);
                    return (
                      <TableRow key={barcode.id} className="border-border">
                        <TableCell className="text-foreground uppercase">
                          {barcode.barcode_type}
                        </TableCell>
                        <TableCell className="text-foreground font-mono">
                          {barcode.barcode_data}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {product ? product.name : "Custom"}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {format(new Date(barcode.created_at), "MMM d, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadBarcode(barcode.id, barcode.barcode_data)}
                            className="text-foreground border-border"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Barcodes;
