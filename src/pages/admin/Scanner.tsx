
import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScanLine, Camera, Search, Package, CheckCircle, AlertCircle, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Scanner = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scannedResults, setScannedResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        
        toast({
          title: "Camera Access Granted! 📹",
          description: "Camera is now active. Position barcode in front of camera.",
        });
      }
    } catch (error: any) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
      
      if (error.name === 'NotAllowedError') {
        toast({
          title: "Camera Permission Denied",
          description: "Please allow camera access in your browser settings and try again.",
          variant: "destructive"
        });
      } else if (error.name === 'NotFoundError') {
        toast({
          title: "No Camera Found",
          description: "No camera device was found. Please connect a camera and try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Camera Error",
          description: "Unable to access camera. Please try manual input instead.",
          variant: "destructive"
        });
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const searchByCode = async (code: string) => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .or(`barcode.eq.${code},sku.eq.${code},id.eq.${code}`)
        .maybeSingle();

      const { data: barcodeData, error: barcodeError } = await supabase
        .from('barcode_generations')
        .select('*')
        .eq('barcode_data', code)
        .maybeSingle();

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (first_name, last_name, email)
        `)
        .eq('id', code)
        .maybeSingle();

      let result = {
        code,
        timestamp: new Date().toISOString(),
        found: false,
        product: null,
        barcode_record: null,
        order: null,
        type: 'unknown'
      };

      if (productData && !productError) {
        result.found = true;
        result.product = productData;
        result.type = 'product';
      }

      if (barcodeData && !barcodeError) {
        result.barcode_record = barcodeData;
        if (!result.found) {
          result.found = true;
          result.type = 'barcode';
        }
      }

      if (orderData && !orderError) {
        result.order = orderData;
        if (!result.found) {
          result.found = true;
          result.type = 'order';
        }
      }

      setScannedResults(prev => [result, ...prev.slice(0, 9)]);

      if (result.found) {
        toast({
          title: "Code Found! ✅",
          description: `Found: ${result.product?.name || result.order ? 'Order #' + result.order.id.slice(-8) : 'Barcode record'}`,
        });
      } else {
        toast({
          title: "Code Not Found ❌",
          description: "No matching product, order, or barcode found",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Search error:', error);
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

  const simulateScan = () => {
    const sampleCodes = [
      '1234567890123',
      '9876543210987',
      'SAMPLE-PRODUCT-001',
      'DEMO-ORDER-123'
    ];
    const randomCode = sampleCodes[Math.floor(Math.random() * sampleCodes.length)];
    setManualCode(randomCode);
    searchByCode(randomCode);
    
    toast({
      title: "Demo Scan Complete! 🎯",
      description: `Simulated scanning code: ${randomCode}`,
    });
  };

  useEffect(() => {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      toast({
        title: "Camera Not Supported",
        description: "Your browser doesn't support camera access. Please use manual input.",
        variant: "destructive"
      });
    }

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
                      muted
                      className="w-full h-64 bg-black rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-32 h-32 border-2 border-primary rounded-lg animate-pulse bg-primary/10"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <QrCode className="h-8 w-8 text-primary animate-bounce" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                      📹 Camera Active - Position barcode in frame
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center">
                      {hasPermission === false ? (
                        <>
                          <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4 animate-shake" />
                          <p className="text-red-600 font-medium mb-2">Camera Access Required</p>
                          <p className="text-muted-foreground text-sm">Please grant camera permission to use scanner</p>
                        </>
                      ) : (
                        <>
                          <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-bounce" />
                          <p className="text-muted-foreground">Camera preview will appear here</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!isScanning ? (
                  <Button 
                    onClick={requestCameraPermission} 
                    className="flex-1 btn-premium"
                    disabled={hasPermission === false}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {hasPermission === false ? 'Camera Unavailable' : 'Start Camera'}
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="destructive" className="flex-1">
                    <ScanLine className="h-4 w-4 mr-2" />
                    Stop Camera
                  </Button>
                )}
                <Button onClick={simulateScan} variant="outline" className="btn-premium">
                  <QrCode className="h-4 w-4 mr-2" />
                  Demo
                </Button>
              </div>

              {hasPermission === false && (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                        Camera Permission Required
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        To use the camera scanner, please:
                      </p>
                      <ol className="list-decimal list-inside mt-2 text-yellow-700 dark:text-yellow-300 space-y-1">
                        <li>Click the camera icon in your browser's address bar</li>
                        <li>Select "Allow" for camera access</li>
                        <li>Refresh the page and try again</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground text-center">
                📱 Position the barcode within the camera frame to scan automatically
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
                  <Label htmlFor="manual-code">Barcode / SKU / Product ID</Label>
                  <Input
                    id="manual-code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter barcode, SKU, or product ID..."
                    className="hover-magnetic"
                  />
                </div>
                
                <Button type="submit" disabled={loading || !manualCode.trim()} className="w-full btn-premium">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search Database
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Button 
                  onClick={simulateScan} 
                  variant="outline" 
                  size="sm"
                  className="animate-bounce-in"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Try Demo Scan
                </Button>
              </div>
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
                  <ScanLine className="h-16 w-16 mx-auto text-gray-400 mb-4 animate-pulse" />
                  <h3 className="text-lg font-medium mb-2">No Scans Yet</h3>
                  <p className="text-muted-foreground">
                    Use the camera or manual input to scan barcodes, SKUs, or product IDs
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
                        result.found ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-red-100 text-red-600 dark:bg-red-900/20'
                      }`}>
                        {result.found ? (
                          <CheckCircle className="h-6 w-6 animate-bounce" />
                        ) : (
                          <AlertCircle className="h-6 w-6 animate-shake" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {result.code}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.product?.name || 
                           result.order ? `Order #${result.order.id.slice(-8)}` : 
                           result.barcode_record ? 'Barcode Record' : 
                           'No match found'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleTimeString()} • Type: {result.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant={result.found ? "default" : "destructive"} className="animate-pulse">
                        {result.found ? 'Found' : 'Not Found'}
                      </Badge>
                      {result.product && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Stock: {result.product.stock_quantity || 0}
                        </p>
                      )}
                      {result.order && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Amount: ${result.order.total_amount}
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
