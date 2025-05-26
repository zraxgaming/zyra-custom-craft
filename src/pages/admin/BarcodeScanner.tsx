
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Camera, Upload, Search, Package, ShoppingCart, Plus, Eye, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate barcode reading from image
      const reader = new FileReader();
      reader.onload = () => {
        // In a real implementation, you would use a barcode reading library like QuaggaJS
        const simulatedBarcode = "123456789012";
        setScannedData(simulatedBarcode);
        handleSearch(simulatedBarcode);
        toast({
          title: "Image processed",
          description: `Simulated barcode: ${simulatedBarcode}`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualEntry = () => {
    if (scannedData.trim()) {
      handleSearch(scannedData);
    }
  };

  const handleSearch = async (barcode: string) => {
    setIsSearching(true);
    setSearchResult(null);
    
    try {
      console.log("Searching for barcode:", barcode);
      
      // First, search for products by barcode
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("barcode", barcode)
        .maybeSingle();

      if (productData) {
        setSearchResult({
          type: "product",
          data: productData
        });
        toast({
          title: "Product found",
          description: `Found product: ${productData.name}`,
        });
        return;
      }

      // If not found as product barcode, search in barcode_generations
      const { data: barcodeData, error: barcodeError } = await supabase
        .from("barcode_generations")
        .select(`
          *,
          products (*)
        `)
        .eq("barcode_data", barcode)
        .maybeSingle();

      if (barcodeData) {
        setSearchResult({
          type: "generated_barcode",
          data: barcodeData
        });
        toast({
          title: "Generated barcode found",
          description: barcodeData.products ? `Product: ${barcodeData.products.name}` : "Barcode found in system",
        });
        return;
      }

      // Search for orders by tracking number or order ID
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          profiles (email, first_name, last_name, display_name, full_name)
        `)
        .or(`id.eq.${barcode},tracking_number.eq.${barcode}`)
        .maybeSingle();

      if (orderData) {
        setSearchResult({
          type: "order",
          data: orderData
        });
        toast({
          title: "Order found",
          description: `Order #${orderData.id.slice(0, 8)}`,
        });
        return;
      }

      // No results found
      setSearchResult(null);
      toast({
        title: "No results",
        description: "No matching product, barcode, or order found",
        variant: "destructive",
      });

    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search error",
        description: "An error occurred while searching",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const startCameraScanning = () => {
    setIsScanning(true);
    // In a real implementation, you would access the camera and use a barcode scanning library
    toast({
      title: "Camera scanning",
      description: "Camera barcode scanning would start here. For demo, we'll simulate a scan.",
    });
    setTimeout(() => {
      setIsScanning(false);
      const simulatedBarcode = "123456789012";
      setScannedData(simulatedBarcode);
      handleSearch(simulatedBarcode);
    }, 2000);
  };

  const generateBarcode = async () => {
    if (!scannedData.trim()) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("barcode_generations")
        .insert({
          barcode_data: scannedData,
          barcode_type: "qr",
          generated_by: user?.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Barcode generated",
        description: "Barcode has been saved to the system",
      });
    } catch (error) {
      console.error("Error generating barcode:", error);
      toast({
        title: "Error",
        description: "Failed to generate barcode",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Barcode Scanner</h1>
          <Button 
            onClick={generateBarcode}
            disabled={!scannedData.trim()}
            className="bg-primary hover:bg-primary/90 hover:scale-105 transition-transform"
          >
            <Plus className="mr-2 h-4 w-4" />
            Generate Barcode
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <Card className="bg-card border-border animate-scale-in">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Scan Barcode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={startCameraScanning}
                disabled={isScanning}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              >
                <Camera className="mr-2 h-4 w-4" />
                {isScanning ? "Scanning..." : "Start Camera Scan"}
              </Button>
              
              <div className="text-center text-muted-foreground">or</div>
              
              <div>
                <Label htmlFor="barcode-file" className="text-foreground">Upload Barcode Image</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="barcode-file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full text-foreground border-border hover:bg-muted hover:scale-105 transition-all duration-300"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Image
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-muted-foreground">or</div>
              
              <div>
                <Label htmlFor="manual-entry" className="text-foreground">Manual Entry</Label>
                <div className="mt-2 flex space-x-2">
                  <Input
                    id="manual-entry"
                    value={scannedData}
                    onChange={(e) => setScannedData(e.target.value)}
                    placeholder="Enter barcode manually"
                    className="bg-background text-foreground border-border"
                  />
                  <Button 
                    onClick={handleManualEntry} 
                    disabled={!scannedData.trim() || isSearching}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card border-border animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="text-foreground">Scan Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : scannedData ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground">Scanned Data:</Label>
                    <div className="mt-1 p-3 bg-muted rounded border font-mono text-sm break-all">
                      {scannedData}
                    </div>
                  </div>
                  
                  {searchResult && (
                    <div>
                      <Label className="text-foreground">Search Result:</Label>
                      <Card className="mt-2 p-4 bg-background border-border">
                        {searchResult.type === 'product' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-foreground">Product Found</span>
                            </div>
                            <p className="text-foreground font-medium">{searchResult.data.name}</p>
                            <p className="text-muted-foreground">${searchResult.data.price}</p>
                            <p className="text-muted-foreground">SKU: {searchResult.data.sku || 'N/A'}</p>
                            <p className="text-muted-foreground">
                              Status: {searchResult.data.in_stock ? 'In Stock' : 'Out of Stock'}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/products/${searchResult.data.slug}`)}
                                className="hover:scale-105 transition-transform"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Product
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/admin/products/edit/${searchResult.data.id}`)}
                                className="hover:scale-105 transition-transform"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Product
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {searchResult.type === 'order' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-foreground">Order Found</span>
                            </div>
                            <p className="text-foreground font-medium">Order #{searchResult.data.id.slice(0, 8)}</p>
                            <p className="text-muted-foreground">
                              Customer: {searchResult.data.profiles?.display_name || 
                                        `${searchResult.data.profiles?.first_name} ${searchResult.data.profiles?.last_name}` || 
                                        searchResult.data.profiles?.email || 'Guest'}
                            </p>
                            <p className="text-muted-foreground">Total: ${searchResult.data.total_amount}</p>
                            <p className="text-muted-foreground">Status: {searchResult.data.status}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/admin/orders/${searchResult.data.id}`)}
                              className="mt-3 hover:scale-105 transition-transform"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Order
                            </Button>
                          </div>
                        )}
                        
                        {searchResult.type === 'generated_barcode' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-foreground">Generated Barcode</span>
                            </div>
                            <p className="text-muted-foreground">Type: {searchResult.data.barcode_type}</p>
                            {searchResult.data.products && (
                              <>
                                <p className="text-foreground">Product: {searchResult.data.products.name}</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/admin/products/edit/${searchResult.data.products.id}`)}
                                  className="mt-3 hover:scale-105 transition-transform"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Product
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </Card>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-foreground">Quick Actions:</Label>
                    <div className="mt-2 space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full text-foreground border-border hover:bg-muted hover:scale-105 transition-all duration-300"
                        onClick={() => handleSearch(scannedData)}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Search Again
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No barcode scanned yet</p>
                  <p className="text-sm">Scan or enter a barcode to get started</p>
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
