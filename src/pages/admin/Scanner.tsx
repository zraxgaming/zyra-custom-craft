
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Package, Plus, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const Scanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [productInfo, setProductInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newStock, setNewStock] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleScan = async (barcode: string) => {
    if (!barcode.trim()) return;

    setIsLoading(true);
    try {
      // Search by barcode first, then SKU, then name
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`barcode.eq.${barcode},sku.eq.${barcode},name.ilike.%${barcode}%`)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setProductInfo(data[0]);
        setNewStock(data[0].stock_quantity?.toString() || "0");
        toast({
          title: "Product found",
          description: `Found: ${data[0].name}`,
        });
      } else {
        setProductInfo(null);
        toast({
          title: "Product not found",
          description: "No product matches this barcode/SKU.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Search error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStock = async () => {
    if (!productInfo || !newStock) return;

    const stockQuantity = parseInt(newStock);
    if (isNaN(stockQuantity) || stockQuantity < 0) {
      toast({
        title: "Invalid stock quantity",
        description: "Please enter a valid number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: stockQuantity,
          in_stock: stockQuantity > 0,
          stock_status: stockQuantity > 0 ? 'in_stock' : 'out_of_stock'
        })
        .eq('id', productInfo.id);

      if (error) throw error;

      setProductInfo(prev => ({ 
        ...prev, 
        stock_quantity: stockQuantity,
        in_stock: stockQuantity > 0,
        stock_status: stockQuantity > 0 ? 'in_stock' : 'out_of_stock'
      }));
      
      toast({
        title: "Stock updated",
        description: `Stock updated to ${stockQuantity} units.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating stock",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateBarcode = async () => {
    if (!scanResult.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('barcode_generations')
        .insert({
          barcode_data: scanResult,
          barcode_type: 'code128',
          generated_by: user.id,
          product_id: productInfo?.id || null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Barcode generated",
        description: `Barcode ${scanResult} has been registered in the system.`,
      });
    } catch (error: any) {
      toast({
        title: "Error generating barcode",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product Scanner</h1>
            <p className="text-muted-foreground">Search products by barcode, SKU, or name</p>
          </div>
          <Button onClick={generateBarcode} disabled={!scanResult.trim()}>
            <Plus className="mr-2 h-4 w-4" />
            Register Barcode
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Product
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="barcode">Barcode / SKU / Product Name</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="barcode"
                    placeholder="Enter barcode, SKU, or product name..."
                    value={scanResult}
                    onChange={(e) => setScanResult(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleScan(scanResult)}
                  />
                  <Button 
                    onClick={() => handleScan(scanResult)}
                    disabled={isLoading || !scanResult.trim()}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>• Enter a barcode number (e.g., 1234567890123)</p>
                <p>• Enter a product SKU (e.g., SKU-001)</p>
                <p>• Enter part of a product name</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : productInfo ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{productInfo.name}</h3>
                      <p className="text-sm text-muted-foreground">{productInfo.category}</p>
                    </div>
                    <Badge variant={productInfo.in_stock ? "default" : "destructive"}>
                      {productInfo.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  {productInfo.images && productInfo.images.length > 0 && (
                    <img 
                      src={productInfo.images[0]} 
                      alt={productInfo.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">${productInfo.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">SKU</p>
                      <p className="font-medium">{productInfo.sku || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Barcode</p>
                      <p className="font-medium">{productInfo.barcode || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{productInfo.status}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label htmlFor="stock">Update Stock Quantity</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        placeholder="Enter new stock quantity"
                      />
                      <Button onClick={updateStock}>
                        Update
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Current stock: {productInfo.stock_quantity} units
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`/admin/products/edit/${productInfo.id}`, '_blank')}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Product
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No product selected</h3>
                  <p className="text-muted-foreground">Search for a product to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Search className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium mb-1">Search Products</h4>
                <p className="text-sm text-muted-foreground">
                  Enter barcode, SKU, or product name to find items in your inventory
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium mb-1">Manage Stock</h4>
                <p className="text-sm text-muted-foreground">
                  Update stock quantities and view product information instantly
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium mb-1">Register Barcodes</h4>
                <p className="text-sm text-muted-foreground">
                  Add new barcodes to your system for future scanning
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Scanner;
