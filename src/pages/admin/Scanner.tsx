
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScanLine, Search, Package, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Scanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [productInfo, setProductInfo] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScan = async (barcode: string) => {
    if (!barcode.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`barcode.eq.${barcode},sku.eq.${barcode},name.ilike.%${barcode}%`)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setProductInfo(data[0]);
        toast({
          title: "Product found",
          description: `Found: ${data[0].name}`,
        });
      } else {
        setProductInfo(null);
        toast({
          title: "Product not found",
          description: "No product matches this barcode.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Scan error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = () => {
    setIsScanning(true);
    toast({
      title: "Camera scanning",
      description: "Camera scanning would start here. Use manual input for now.",
    });
  };

  const updateStock = async (productId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', productId);

      if (error) throw error;

      setProductInfo(prev => ({ ...prev, stock_quantity: newQuantity }));
      
      toast({
        title: "Stock updated",
        description: "Product stock has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating stock",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Barcode Scanner</h1>
          <p className="text-muted-foreground">Scan products and manage inventory</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="h-5 w-5" />
                Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                {isScanning ? (
                  <div className="text-center">
                    <ScanLine className="h-16 w-16 mx-auto text-primary animate-pulse" />
                    <p className="text-muted-foreground mt-2">Scanning for barcode...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <ScanLine className="h-16 w-16 mx-auto text-muted-foreground/50" />
                    <p className="text-muted-foreground mt-2">Camera view will appear here</p>
                  </div>
                )}
              </div>

              <Button 
                onClick={startCamera} 
                className="w-full"
                disabled={isScanning}
              >
                <ScanLine className="h-4 w-4 mr-2" />
                {isScanning ? "Scanning..." : "Start Camera Scanner"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or scan manually</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode or product name..."
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
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {productInfo ? (
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
                      <p className="text-sm text-muted-foreground">Current Stock</p>
                      <p className="font-medium">{productInfo.stock_quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{productInfo.status}</p>
                    </div>
                  </div>

                  {productInfo.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{productInfo.description}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Quick Stock Actions</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStock(productInfo.id, productInfo.stock_quantity - 1)}
                        disabled={productInfo.stock_quantity === 0}
                      >
                        -1
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStock(productInfo.id, productInfo.stock_quantity + 1)}
                      >
                        +1
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStock(productInfo.id, productInfo.stock_quantity + 10)}
                      >
                        +10
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No product selected</h3>
                  <p className="text-muted-foreground">Scan or search for a product to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Recent scan history will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Scanner;
