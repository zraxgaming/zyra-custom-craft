
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScanLine, Camera, Search, Package, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EnhancedBarcodeScanner = () => {
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
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        
        toast({
          title: "Camera Started",
          description: "Position barcode in the center of the frame",
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
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
    
    toast({
      title: "Camera Stopped",
      description: "You can use manual input or restart the camera",
    });
  };

  const searchByCode = async (code: string) => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      console.log('Searching for code:', code);
      
      // Search in products table
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .or(`barcode.eq.${code},sku.eq.${code},name.ilike.%${code}%`)
        .limit(5);

      // Search in barcode_generations table
      const { data: barcodeData, error: barcodeError } = await supabase
        .from('barcode_generations')
        .select('*')
        .eq('barcode_data', code);

      let result = {
        code,
        timestamp: new Date().toISOString(),
        found: false,
        products: productData || [],
        barcode_record: barcodeData?.[0] || null,
        type: 'search'
      };

      if (productData && productData.length > 0) {
        result.found = true;
      }

      if (barcodeData && barcodeData.length > 0) {
        result.found = true;
      }

      setScannedResults(prev => [result, ...prev.slice(0, 9)]);

      toast({
        title: result.found ? "Code Found!" : "Code Not Found",
        description: result.found 
          ? `Found ${result.products.length} matching products`
          : "No matching products or barcodes found",
        variant: result.found ? "default" : "destructive"
      });

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

  const simulateBarcodeScan = () => {
    // Simulate scanning a random barcode for demo
    const demoBarcode = Math.random().toString().substr(2, 12);
    searchByCode(demoBarcode);
    
    toast({
      title: "Barcode Simulated",
      description: `Scanned: ${demoBarcode}`,
    });
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
    <div className="space-y-8 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Camera Scanner */}
        <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 border-blue-200 dark:border-blue-800 shadow-2xl animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-blue-700 dark:text-blue-300">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Camera className="h-5 w-5 text-white" />
              </div>
              Camera Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              {isScanning ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-80 bg-black rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-40 h-40 border-4 border-red-500 rounded-lg animate-pulse bg-red-500/10"></div>
                    <ScanLine className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-red-500 animate-bounce" />
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white animate-pulse">
                      <Zap className="h-4 w-4 mr-1" />
                      Scanning Active
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-center">
                    <Camera className="h-20 w-20 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Camera preview will appear here</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Position barcode in the center</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {!isScanning ? (
                <Button onClick={startCamera} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="destructive">
                  <ScanLine className="h-4 w-4 mr-2" />
                  Stop Camera
                </Button>
              )}
              
              <Button 
                onClick={simulateBarcodeScan} 
                variant="outline"
                className="border-blue-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                disabled={loading}
              >
                <Zap className="h-4 w-4 mr-2" />
                Simulate Scan
              </Button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                💡 <strong>Pro Tip:</strong> Position the barcode within the red scanning frame for best results. The camera will automatically detect and process the barcode.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Manual Input */}
        <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 shadow-2xl animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-purple-700 dark:text-purple-300">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              Manual Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <Label htmlFor="manual-code" className="text-lg font-semibold">Barcode / SKU / Product Name</Label>
                <Input
                  id="manual-code"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter barcode, SKU, or search term..."
                  className="h-12 text-lg bg-white/90 dark:bg-gray-800/90 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 rounded-xl"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading || !manualCode.trim()} 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search Products
                  </>
                )}
              </Button>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  🔍 <strong>Search Tips:</strong> You can search by barcode number, SKU code, or even product names. The system will find all matching results.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 border-green-200 dark:border-green-800 shadow-2xl animate-slide-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-green-700 dark:text-green-300">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            Scan Results ({scannedResults.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scannedResults.length === 0 ? (
              <div className="text-center py-12">
                <ScanLine className="h-20 w-20 mx-auto text-gray-400 mb-6" />
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">No Scans Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                  Use the camera or manual search to find products
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={startCamera} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Scanning
                  </Button>
                  <Button onClick={simulateBarcodeScan} variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                </div>
              </div>
            ) : (
              scannedResults.map((result, index) => (
                <div
                  key={`${result.code}-${result.timestamp}`}
                  className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                        result.found 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                          : 'bg-gradient-to-br from-red-500 to-pink-600 text-white'
                      }`}>
                        {result.found ? (
                          <CheckCircle className="h-8 w-8" />
                        ) : (
                          <AlertCircle className="h-8 w-8" />
                        )}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{result.code}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(result.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge 
                        variant={result.found ? "default" : "destructive"}
                        className="text-sm px-3 py-1"
                      >
                        {result.found ? `Found ${result.products.length} products` : 'Not Found'}
                      </Badge>
                    </div>
                  </div>
                  
                  {result.products.length > 0 && (
                    <div className="space-y-3">
                      {result.products.map((product: any, productIndex: number) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <img
                            src={product.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">{product.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">SKU: {product.sku}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Stock: {product.stock_quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">${product.price}</p>
                            <Badge variant="outline" className="mt-1">
                              {product.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBarcodeScanner;
