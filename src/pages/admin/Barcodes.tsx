
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Download, Search, Package } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import QRCode from "qrcode";

const AdminBarcodes = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [barcodes, setBarcodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [barcodeType, setBarcodeType] = useState("qr");
  const [customData, setCustomData] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchBarcodes();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku')
        .eq('status', 'published')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    }
  };

  const fetchBarcodes = async () => {
    try {
      const { data, error } = await supabase
        .from('barcode_generations')
        .select(`
          *,
          products (
            name,
            sku
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBarcodes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch barcodes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateBarcode = async () => {
    if (!selectedProduct && !customData) {
      toast({
        title: "Selection Required",
        description: "Please select a product or enter custom data",
        variant: "destructive"
      });
      return;
    }

    setGenerateLoading(true);
    try {
      let barcodeData = customData;
      let productId = null;

      if (selectedProduct) {
        const product = products.find(p => p.id === selectedProduct);
        barcodeData = `${window.location.origin}/product/${product?.sku || selectedProduct}`;
        productId = selectedProduct;
      }

      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(barcodeData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Save to database
      const { error } = await supabase
        .from('barcode_generations')
        .insert({
          product_id: productId,
          barcode_type: barcodeType,
          barcode_data: barcodeData,
          generated_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Barcode Generated",
        description: "Barcode has been generated successfully"
      });

      // Download the barcode
      const link = document.createElement('a');
      link.download = `barcode-${Date.now()}.png`;
      link.href = qrCodeDataURL;
      link.click();

      fetchBarcodes();
      setSelectedProduct("");
      setCustomData("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setGenerateLoading(false);
    }
  };

  const downloadBarcode = async (barcodeData: string, id: string) => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(barcodeData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      const link = document.createElement('a');
      link.download = `barcode-${id}.png`;
      link.href = qrCodeDataURL;
      link.click();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download barcode",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <QrCode className="h-8 w-8" />
            Barcode Generator
          </h1>
        </div>

        {/* Generate Barcode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Generate New Barcode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="barcode-type">Barcode Type</Label>
                <Select value={barcodeType} onValueChange={setBarcodeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select barcode type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qr">QR Code</SelectItem>
                    <SelectItem value="barcode">Barcode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="product-select">Select Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="custom-data">Or Enter Custom Data</Label>
              <Input
                id="custom-data"
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                placeholder="Enter custom barcode data (URL, text, etc.)"
              />
            </div>

            <Button onClick={generateBarcode} disabled={generateLoading}>
              {generateLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate & Download Barcode
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Barcodes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Generated Barcodes ({barcodes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {barcodes.map((barcode) => (
                <div key={barcode.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {barcode.products?.name || 'Custom Barcode'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {barcode.barcode_type.toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Data: {barcode.barcode_data}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Generated: {new Date(barcode.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => downloadBarcode(barcode.barcode_data, barcode.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBarcodes;
