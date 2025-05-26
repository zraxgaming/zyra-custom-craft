
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  QrCode, 
  Package, 
  ShoppingCart, 
  Search, 
  Edit, 
  Eye, 
  ExternalLink,
  Scan,
  Camera,
  Upload
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ScanResult {
  type: 'product' | 'order' | 'barcode' | 'unknown';
  data: any;
  code: string;
}

const EnhancedBarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const searchByCode = async (code: string) => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      // Search in products table by barcode
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', code)
        .limit(1);

      if (products && products.length > 0) {
        setScanResult({
          type: 'product',
          data: products[0],
          code
        });
        return;
      }

      // Search in orders table by tracking_number
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            display_name,
            email,
            first_name,
            last_name
          )
        `)
        .eq('tracking_number', code)
        .limit(1);

      if (orders && orders.length > 0) {
        setScanResult({
          type: 'order',
          data: orders[0],
          code
        });
        return;
      }

      // Search in barcode_generations table
      const { data: barcodes } = await supabase
        .from('barcode_generations')
        .select(`
          *,
          products (
            name,
            price,
            images
          )
        `)
        .eq('barcode_data', code)
        .limit(1);

      if (barcodes && barcodes.length > 0) {
        setScanResult({
          type: 'barcode',
          data: barcodes[0],
          code
        });
        return;
      }

      // No results found
      setScanResult({
        type: 'unknown',
        data: null,
        code
      });

      toast({
        title: "No results found",
        description: `No product, order, or barcode found for: ${code}`,
        variant: "destructive"
      });

    } catch (error: any) {
      console.error("Error searching by code:", error);
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = () => {
    searchByCode(manualCode);
  };

  const startCamera = async () => {
    setIsScanning(true);
    try {
      // In a real implementation, you would use a barcode scanning library
      // For now, we'll simulate scanning with a random existing code
      setTimeout(() => {
        // Simulate finding a product barcode
        const simulatedCode = "SIM-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        searchByCode(simulatedCode);
        setIsScanning(false);
      }, 2000);
    } catch (error) {
      setIsScanning(false);
      toast({
        title: "Camera error",
        description: "Could not access camera for scanning",
        variant: "destructive"
      });
    }
  };

  const renderResult = () => {
    if (!scanResult) return null;

    const { type, data, code } = scanResult;

    switch (type) {
      case 'product':
        return (
          <Card className="mt-6 animate-scale-in border-green-200 bg-green-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Product Found</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {code}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                {data.images && data.images.length > 0 && (
                  <img 
                    src={data.images[0]} 
                    alt={data.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{data.name}</h3>
                  <p className="text-muted-foreground">{data.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-2xl font-bold text-green-600">
                      ${data.price}
                    </span>
                    <Badge variant={data.in_stock ? "default" : "destructive"}>
                      {data.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate(`/products/${data.slug}`)}
                  className="hover:scale-105 transition-transform"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Product
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/admin/products/edit/${data.id}`)}
                  className="hover:scale-105 transition-transform"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'order':
        return (
          <Card className="mt-6 animate-scale-in border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Order Found</CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {code}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Order ID</p>
                  <p className="text-muted-foreground">{data.id}</p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <Badge variant="outline">{data.status}</Badge>
                </div>
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">${data.total_amount}</p>
                </div>
                <div>
                  <p className="font-medium">Customer</p>
                  <p className="text-muted-foreground">
                    {data.profiles?.display_name || data.profiles?.first_name || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate(`/admin/orders/${data.id}`)}
                  className="hover:scale-105 transition-transform"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Order
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/order-tracking", { state: { trackingNumber: code } })}
                  className="hover:scale-105 transition-transform"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'barcode':
        return (
          <Card className="mt-6 animate-scale-in border-purple-200 bg-purple-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <QrCode className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">Generated Barcode</CardTitle>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {data.barcode_type?.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Barcode Type</p>
                  <p className="text-muted-foreground">{data.barcode_type}</p>
                </div>
                <div>
                  <p className="font-medium">Generated</p>
                  <p className="text-muted-foreground">
                    {new Date(data.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {data.products && (
                <div>
                  <p className="font-medium mb-2">Associated Product</p>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span>{data.products.name}</span>
                    <span className="text-green-600 font-medium">${data.products.price}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate("/admin/barcodes")}
                  className="hover:scale-105 transition-transform"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  View All Barcodes
                </Button>
                {data.product_id && (
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/admin/products/edit/${data.product_id}`)}
                    className="hover:scale-105 transition-transform"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="mt-6 animate-scale-in border-red-200 bg-red-50/50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 font-medium">No matching records found for: {code}</p>
              <p className="text-muted-foreground mt-2">
                Try scanning a different code or check if the code exists in your system.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl">
              <Scan className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Enhanced Barcode Scanner</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Scanner */}
          <div className="text-center">
            <Button 
              onClick={startCamera}
              disabled={isScanning}
              className="bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-all duration-300"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              {isScanning ? "Scanning..." : "Start Camera Scan"}
            </Button>
            {isScanning && (
              <div className="mt-4 p-8 border-2 border-dashed border-primary rounded-lg bg-primary/5">
                <div className="animate-pulse">
                  <QrCode className="h-16 w-16 mx-auto text-primary mb-4" />
                  <p className="text-primary font-medium">Scanning for barcodes...</p>
                </div>
              </div>
            )}
          </div>

          {/* Manual Input */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter barcode, tracking number, or product code"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleManualSearch}
                disabled={isLoading || !manualCode.trim()}
                className="hover:scale-105 transition-transform"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Searching database...</p>
            </div>
          )}

          {/* Results */}
          {renderResult()}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBarcodeScanner;
