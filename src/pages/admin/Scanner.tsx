
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Camera, Upload, Search, Package } from "lucide-react";

interface ScannedProduct {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  in_stock: boolean;
}

const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to scan barcodes.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const searchProduct = async (code: string) => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku, barcode, price, in_stock")
        .or(`barcode.eq.${code},sku.eq.${code}`)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setScannedProduct(data);
        toast({
          title: "Product found",
          description: `Found: ${data.name}`,
        });
      } else {
        setScannedProduct(null);
        toast({
          title: "Product not found",
          description: "No product found with this code.",
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

  const handleManualSearch = () => {
    searchProduct(manualCode);
  };

  // Simulate barcode scanning (in production, integrate with a barcode scanning library)
  const simulateScan = () => {
    // This would be replaced with actual barcode detection
    const mockBarcode = "1234567890123";
    searchProduct(mockBarcode);
    setManualCode(mockBarcode);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Barcode Scanner</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Camera className="mr-2 h-5 w-5" />
                Camera Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-gray-900 rounded-lg"
                  style={{ display: isScanning ? 'block' : 'none' }}
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                {!isScanning && (
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Camera not active</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!isScanning ? (
                  <Button onClick={startCamera} className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopCamera} variant="outline" className="flex-1">
                      Stop Camera
                    </Button>
                    <Button onClick={simulateScan} className="flex-1">
                      Simulate Scan
                    </Button>
                  </>
                )}
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Point your camera at a barcode to scan it automatically
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Search className="mr-2 h-5 w-5" />
                Manual Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="manual-code" className="text-foreground">
                  Enter Barcode or SKU
                </Label>
                <Input
                  id="manual-code"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter barcode or SKU"
                  className="bg-background text-foreground border-border"
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                />
              </div>

              <Button 
                onClick={handleManualSearch} 
                disabled={isLoading || !manualCode.trim()}
                className="w-full"
              >
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Product
                  </>
                )}
              </Button>

              <div className="text-sm text-muted-foreground">
                <p>You can search by:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Product barcode</li>
                  <li>Product SKU</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {scannedProduct && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Package className="mr-2 h-5 w-5" />
                Scanned Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-muted-foreground">Product Name</Label>
                  <p className="font-medium text-foreground">{scannedProduct.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">SKU</Label>
                  <p className="font-mono text-foreground">{scannedProduct.sku || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price</Label>
                  <p className="font-medium text-foreground">${scannedProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Stock Status</Label>
                  <p className={`font-medium ${scannedProduct.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                    {scannedProduct.in_stock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Scanner;
