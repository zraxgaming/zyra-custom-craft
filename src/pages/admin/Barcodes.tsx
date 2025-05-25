
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QrCode, Download, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Barcodes = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [barcodes, setBarcodes] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [barcodeType, setBarcodeType] = useState("qr");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchBarcodes();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, price')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBarcodes = async () => {
    try {
      const { data, error } = await supabase
        .from('barcode_generations')
        .select(`
          *,
          products (name, sku)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBarcodes(data || []);
    } catch (error: any) {
      console.error('Error fetching barcodes:', error);
    }
  };

  const generateBarcode = async () => {
    if (!selectedProduct) {
      toast({
        title: "Please select a product",
        description: "You need to select a product to generate a barcode.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const product = products.find(p => p.id === selectedProduct);
      const barcodeData = `${product.name}-${product.sku || product.id}`;

      const { error } = await supabase
        .from('barcode_generations')
        .insert({
          product_id: selectedProduct,
          barcode_type: barcodeType,
          barcode_data: barcodeData
        });

      if (error) throw error;

      await fetchBarcodes();
      setSelectedProduct("");

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
      setIsLoading(false);
    }
  };

  const downloadBarcode = (barcodeId: string, productName: string) => {
    // In a real implementation, this would generate and download the actual barcode
    toast({
      title: "Download started",
      description: `Downloading barcode for ${productName}`,
    });
  };

  const filteredBarcodes = barcodes.filter(barcode =>
    barcode.products?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barcode.products?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Barcode Generator</h1>
          <p className="text-muted-foreground">Generate and manage product barcodes</p>
        </div>

        {/* Generate Barcode Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Generate New Barcode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Select Product</Label>
                <select
                  id="product"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} {product.sku && `(${product.sku})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcodeType">Barcode Type</Label>
                <select
                  id="barcodeType"
                  value={barcodeType}
                  onChange={(e) => setBarcodeType(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="qr">QR Code</option>
                  <option value="code128">Code 128</option>
                  <option value="ean13">EAN-13</option>
                  <option value="upc">UPC</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={generateBarcode} 
                  disabled={isLoading || !selectedProduct}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isLoading ? "Generating..." : "Generate Barcode"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barcode History */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Generated Barcodes</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search barcodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredBarcodes.length === 0 ? (
              <div className="text-center py-12">
                <QrCode className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No barcodes generated yet</h3>
                <p className="text-muted-foreground">Generate your first barcode to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Generated On</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBarcodes.map((barcode) => (
                      <TableRow key={barcode.id}>
                        <TableCell className="font-medium">
                          {barcode.products?.name || 'Unknown Product'}
                        </TableCell>
                        <TableCell>{barcode.products?.sku || '—'}</TableCell>
                        <TableCell className="uppercase">{barcode.barcode_type}</TableCell>
                        <TableCell>
                          {new Date(barcode.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadBarcode(barcode.id, barcode.products?.name)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Barcodes;
