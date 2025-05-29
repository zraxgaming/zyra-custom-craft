
import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Camera, Scan, StopCircle, Package, AlertCircle } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const AdminScanner = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scannedProducts, setScannedProducts] = useState<any[]>([]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
        
        toast({
          title: "Camera Started",
          description: "Point your camera at a barcode to scan",
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
    
    toast({
      title: "Camera Stopped",
      description: "Scanning has been stopped",
    });
  };

  const simulateScan = () => {
    // Simulate finding a product
    const mockProduct = {
      id: `PROD_${Date.now()}`,
      name: `Scanned Product ${scannedProducts.length + 1}`,
      sku: `SKU${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      barcode: Math.random().toString().substring(2, 15),
      price: Math.random() * 100 + 10,
      stock: Math.floor(Math.random() * 50) + 1,
      scannedAt: new Date().toLocaleString()
    };

    setScannedProducts(prev => [mockProduct, ...prev]);
    
    toast({
      title: "Product Scanned!",
      description: `Found: ${mockProduct.name}`,
    });
  };

  return (
    <>
      <SEOHead 
        title="Barcode Scanner - Admin Dashboard"
        description="Scan product barcodes for inventory management and product lookup."
      />
      <AdminLayout>
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between animate-slide-in-left">
            <div className="flex items-center gap-3">
              <Scan className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Barcode Scanner
              </h1>
              <Badge variant="secondary" className="animate-bounce">
                {scannedProducts.length} scanned
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Camera Section */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Camera className="h-6 w-6 animate-bounce" />
                  Camera Scanner
                  {isScanning && (
                    <Badge variant="secondary" className="bg-green-500 text-white animate-pulse">
                      Live
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    {!isScanning && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                        <div className="text-center text-white">
                          <Camera className="h-16 w-16 mx-auto mb-4 opacity-50 animate-pulse" />
                          <p className="text-lg font-semibold">Camera Inactive</p>
                          <p className="text-sm opacity-75">Start camera to begin scanning</p>
                        </div>
                      </div>
                    )}
                    
                    {isScanning && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Scanning overlay */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-48 h-32 border-2 border-green-400 rounded-lg animate-pulse">
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                          </div>
                          <div className="text-center mt-4">
                            <p className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded">
                              Position barcode in frame
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    {!isScanning ? (
                      <Button
                        onClick={startCamera}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Start Camera
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={stopCamera}
                          variant="destructive"
                          className="flex-1 font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          <StopCircle className="h-5 w-5 mr-2" />
                          Stop Camera
                        </Button>
                        <Button
                          onClick={simulateScan}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          <Scan className="h-5 w-5 mr-2" />
                          Test Scan
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Scanner Tips:</p>
                        <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Hold device steady and ensure good lighting</li>
                          <li>• Position barcode clearly within the frame</li>
                          <li>• Keep barcode flat and unobstructed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scanned Products */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 animate-slide-in-right">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Package className="h-6 w-6 animate-bounce" />
                  Scanned Products
                  <Badge variant="secondary" className="bg-white/20">
                    {scannedProducts.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {scannedProducts.length === 0 ? (
                    <div className="text-center py-12 animate-bounce-in">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-float" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Products Scanned</h3>
                      <p className="text-gray-500 dark:text-gray-400">Start scanning to see products here</p>
                    </div>
                  ) : (
                    scannedProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-all duration-300 animate-slide-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{product.name}</h4>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
                              <div>
                                <span className="font-medium">SKU:</span> {product.sku}
                              </div>
                              <div>
                                <span className="font-medium">Price:</span> ${product.price.toFixed(2)}
                              </div>
                              <div>
                                <span className="font-medium">Stock:</span> {product.stock}
                              </div>
                              <div>
                                <span className="font-medium">Scanned:</span> {product.scannedAt}
                              </div>
                            </div>
                            <div className="mt-2">
                              <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                                {product.barcode}
                              </code>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Badge 
                              variant="secondary" 
                              className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            >
                              In Stock
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminScanner;
