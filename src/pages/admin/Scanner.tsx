
import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScanLine, Camera, Search, Package, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Scanner = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scannedResults, setScannedResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please use manual input.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const searchByCode = async (code: string) => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      // Search in products table
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .or(`barcode.eq.${code},sku.eq.${code}`)
        .single();

      // Search in barcode_generations table
      const { data: barcodeData, error: barcodeError } = await supabase
        .from('barcode_generations')
        .select('*')
        .eq('barcode_data', code);

      let result = {
        code,
        timestamp: new Date().toISOString(),
        found: false,
        product: null,
        barcode_record: null
      };

      if (productData && !productError) {
        result.found = true;
        result.product = productData;
      }

      if (barcodeData && barcodeData.length > 0) {
        result.barcode_record = barcodeData[0];
        if (!result.found) result.found = true;
      }

      setScannedResults(prev => [result, ...prev.slice(0, 9)]);

      toast({
        title: result.found ? "Code Found!" : "Code Not Found",
        description: result.found 
          ? `Found: ${result.product?.name || 'Barcode record'}`
          : "No matching product or barcode found",
        variant: result.found ? "default" : "destructive"
      });

    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search for barcode",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchByCode(manualCode);
    setManualCode("");
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ScanLine className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold">Barcode Scanner</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <Card className="glass-card border-gradient hover-3d-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                {isScanning ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 bg-black rounded-lg"
                    />
                    <div className="absolute inset-0 border-2 border-primary rounded-lg"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-32 border-2 border-primary rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Camera preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!isScanning ? (
                  <Button onClick={startCamera} className="flex-1 btn-premium">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="destructive" className="flex-1">
                    <ScanLine className="h-4 w-4 mr-2" />
                    Stop Camera
                  </Button>
                )}
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Position the barcode within the camera frame to scan
              </p>
            </CardContent>
          </Card>

          {/* Manual Input Section */}
          <Card className="glass-card border-gradient hover-3d-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Manual Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="manual-code">Barcode / SKU</Label>
                  <Input
                    id="manual-code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter barcode or SKU manually"
                    className="hover-magnetic"
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="w-full btn-premium">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <Card className="glass-card border-gradient animate-slide-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Scan Results ({scannedResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scannedResults.length === 0 ? (
                <div className="text-center py-8">
                  <ScanLine className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Scans Yet</h3>
                  <p className="text-muted-foreground">
                    Use the camera or manual input to scan barcodes
                  </p>
                </div>
              ) : (
                scannedResults.map((result, index) => (
                  <div
                    key={`${result.code}-${result.timestamp}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in-up hover-3d-lift"
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        result.found ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {result.found ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <AlertCircle className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{result.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.product?.name || 'No product found'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant={result.found ? "default" : "destructive"}>
                        {result.found ? 'Found' : 'Not Found'}
                      </Badge>
                      {result.product && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Stock: {result.product.stock_quantity}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Scanner;
