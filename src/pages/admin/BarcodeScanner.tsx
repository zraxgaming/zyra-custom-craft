
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Scan, Package, QrCode, Plus } from "lucide-react";
import BarcodeDisplay from "@/components/barcode/BarcodeDisplay";

interface ScannedBarcode {
  id: string;
  barcode_data: string;
  barcode_type: string;
  product_id?: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
}

const BarcodeScanner = () => {
  const { user } = useAuth();
  const [scannedBarcodes, setScannedBarcodes] = useState<ScannedBarcode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBarcode, setNewBarcode] = useState({
    type: "qr" as "qr" | "code128" | "ean13",
    data: "",
    productId: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchScannedBarcodes();
    fetchProducts();
  }, []);

  const fetchScannedBarcodes = async () => {
    try {
      const { data, error } = await supabase
        .from("barcode_generations")
        .select(`
          *,
          products!barcode_generations_product_id_fkey (
            name,
            sku
          )
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setScannedBarcodes(data || []);
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

  const generateBarcode = async () => {
    if (!newBarcode.data.trim()) {
      toast({
        title: "Error",
        description: "Please enter barcode data",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("barcode_generations")
        .insert({
          barcode_type: newBarcode.type,
          barcode_data: newBarcode.data,
          product_id: newBarcode.productId || null,
          generated_by: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Barcode generated",
        description: "Barcode has been generated successfully.",
      });

      setNewBarcode({ type: "qr", data: "", productId: "" });
      fetchScannedBarcodes();
    } catch (error: any) {
      toast({
        title: "Error generating barcode",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const simulateScan = async () => {
    const mockBarcodeData = `SCAN_${Date.now()}`;
    
    try {
      const { error } = await supabase
        .from("barcode_generations")
        .insert({
          barcode_type: "qr",
          barcode_data: mockBarcodeData,
          generated_by: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Barcode scanned",
        description: "Mock barcode has been scanned successfully.",
      });

      fetchScannedBarcodes();
    } catch (error: any) {
      toast({
        title: "Error scanning barcode",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Barcode Management</h1>
          <Button onClick={simulateScan} className="bg-primary text-primary-foreground">
            <Scan className="mr-2 h-4 w-4" />
            Simulate Scan
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Plus className="h-5 w-5" />
                Generate New Barcode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="barcode-type">Barcode Type</Label>
                <Select value={newBarcode.type} onValueChange={(value: any) => setNewBarcode(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qr">QR Code</SelectItem>
                    <SelectItem value="code128">Code 128</SelectItem>
                    <SelectItem value="ean13">EAN-13</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="barcode-data">Barcode Data</Label>
                <Input
                  id="barcode-data"
                  value={newBarcode.data}
                  onChange={(e) => setNewBarcode(prev => ({ ...prev, data: e.target.value }))}
                  placeholder="Enter barcode data"
                />
              </div>

              <div>
                <Label htmlFor="product-select">Link to Product (Optional)</Label>
                <Select value={newBarcode.productId} onValueChange={(value) => setNewBarcode(prev => ({ ...prev, productId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No product</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} {product.sku && `(${product.sku})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateBarcode} className="w-full">
                <QrCode className="mr-2 h-4 w-4" />
                Generate Barcode
              </Button>

              {newBarcode.data && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2 flex justify-center">
                    <BarcodeDisplay
                      type={newBarcode.type}
                      data={newBarcode.data}
                      width={150}
                      height={150}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Package className="h-5 w-5" />
                Recent Barcodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {scannedBarcodes.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No barcodes generated yet
                    </p>
                  ) : (
                    scannedBarcodes.map((barcode) => (
                      <div
                        key={barcode.id}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <BarcodeDisplay
                                type={barcode.barcode_type as any}
                                data={barcode.barcode_data}
                                width={40}
                                height={40}
                              />
                              <div>
                                <p className="font-mono text-sm text-foreground">
                                  {barcode.barcode_data}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {barcode.barcode_type.toUpperCase()}
                                </p>
                              </div>
                            </div>
                            {barcode.product_id && (
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                Linked to product
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(barcode.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BarcodeScanner;
