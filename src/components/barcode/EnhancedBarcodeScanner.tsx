
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, Package, ShoppingCart, QrCode, Upload, CheckCircle, AlertCircle, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EnhancedBarcodeScanner = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        // Start scanning for barcodes
        startBarcodeDetection();
        
        toast({
          title: "Camera Started",
          description: "Position barcode in front of camera to scan",
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions and try manual entry.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const startBarcodeDetection = () => {
    // Simple barcode detection simulation
    const detectInterval = setInterval(() => {
      if (!isScanning || !videoRef.current) {
        clearInterval(detectInterval);
        return;
      }

      // In a real implementation, you would use a library like QuaggaJS or ZXing
      // For demo purposes, we'll simulate detection after a few seconds
      setTimeout(() => {
        if (isScanning) {
          const simulatedBarcode = `SCAN${Date.now().toString().slice(-8)}`;
          handleBarcodeDetected(simulatedBarcode);
          clearInterval(detectInterval);
        }
      }, 3000);
    }, 1000);
  };

  const handleBarcodeDetected = (barcode: string) => {
    setScannedData(barcode);
    setManualBarcode(barcode);
    searchByBarcode(barcode);
    stopScanning();
  };

  const searchByBarcode = async (barcode: string) => {
    if (!barcode.trim()) return;
    
    setIsLoading(true);
    try {
      // Search in products by barcode
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .or(`barcode.eq.${barcode},sku.eq.${barcode},id.eq.${barcode}`);

      if (productsError) throw productsError;

      // Search in orders by ID
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (first_name, last_name, email)
        `)
        .eq('id', barcode);

      if (ordersError) throw ordersError;

      // Search in barcode_generations table
      const { data: barcodeRecords, error: barcodeError } = await supabase
        .from('barcode_generations')
        .select('*')
        .eq('barcode_data', barcode);

      if (barcodeError) throw barcodeError;

      const results = [
        ...(products || []).map(p => ({ ...p, type: 'product' })),
        ...(orders || []).map(o => ({ ...o, type: 'order' })),
        ...(barcodeRecords || []).map(b => ({ ...b, type: 'barcode' }))
      ];

      setSearchResults(results);

      // Add to scan history
      const scanRecord = {
        id: Date.now(),
        barcode,
        timestamp: new Date().toISOString(),
        found: results.length > 0,
        results: results.length
      };
      setScanHistory(prev => [scanRecord, ...prev.slice(0, 9)]);

      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No items found for this barcode. Try a different code.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Scan Successful",
          description: `Found ${results.length} item(s)`,
        });
      }
    } catch (error: any) {
      console.error('Error searching:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for barcode",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = () => {
    if (manualBarcode.trim()) {
      setScannedData(manualBarcode);
      searchByBarcode(manualBarcode);
    }
  };

  const simulateScan = () => {
    const sampleBarcodes = [
      '1234567890123',
      '9876543210987',
      'PROD-001-XYZ',
      'ORDER-123-ABC'
    ];
    const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
    setScannedData(randomBarcode);
    setManualBarcode(randomBarcode);
    searchByBarcode(randomBarcode);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card border-gradient hover-3d-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary animate-pulse" />
            Enhanced Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Section */}
          <div className="text-center">
            {!isScanning ? (
              <div className="space-y-4">
                <div className="w-full max-w-md h-64 bg-muted rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-border relative overflow-hidden">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
                    <p className="text-muted-foreground">Camera preview will appear here</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={startScanning} className="btn-premium hover-3d-lift">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                  <Button variant="outline" onClick={simulateScan} className="hover-magnetic">
                    <QrCode className="h-4 w-4 mr-2" />
                    Demo Scan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full max-w-md h-64 mx-auto">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full bg-black rounded-lg border-2 border-primary object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-32 border-2 border-primary rounded-lg animate-pulse">
                        <div className="absolute inset-0 bg-primary/10 rounded-lg"></div>
                        <Scan className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="destructive" onClick={stopScanning} className="hover-3d-lift">
                    Stop Camera
                  </Button>
                  <Button variant="outline" onClick={simulateScan} className="hover-magnetic">
                    <QrCode className="h-4 w-4 mr-2" />
                    Demo Scan
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Position the barcode within the highlighted area
                </p>
              </div>
            )}
          </div>

          {/* Manual Entry Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px bg-border flex-1"></div>
              <span className="text-sm text-muted-foreground">OR ENTER MANUALLY</span>
              <div className="h-px bg-border flex-1"></div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manual-barcode">Barcode / SKU / Product ID</Label>
              <div className="flex gap-2">
                <Input
                  id="manual-barcode"
                  placeholder="Enter barcode, SKU, or product ID..."
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                  className="hover-magnetic"
                />
                <Button onClick={handleManualSearch} disabled={!manualBarcode.trim()} className="btn-premium">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Last Scanned */}
          {scannedData && (
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800 animate-slide-in-up">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Last Scanned:</p>
              <p className="font-mono text-lg text-green-900 dark:text-green-100">{scannedData}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="glass-card animate-scale-in">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Searching database...</p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="glass-card border-gradient animate-slide-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Results ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors hover-3d-lift animate-slide-in-up"
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {item.type === 'product' ? (
                        <Package className="h-5 w-5 text-primary" />
                      ) : item.type === 'order' ? (
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      ) : (
                        <QrCode className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {item.type === 'product' 
                          ? item.name 
                          : item.type === 'order'
                          ? `Order #${item.id.slice(-8)}`
                          : `Barcode: ${item.barcode_data}`
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.type === 'product' 
                          ? `$${item.price} - Stock: ${item.stock_quantity || 0}`
                          : item.type === 'order'
                          ? `${item.profiles?.first_name || ''} ${item.profiles?.last_name || ''} - $${item.total_amount}`
                          : `Type: ${item.barcode_type?.toUpperCase()}`
                        }
                      </p>
                      {item.barcode && (
                        <p className="text-xs text-muted-foreground font-mono">
                          Barcode: {item.barcode}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={item.type === 'product' ? 'default' : item.type === 'order' ? 'secondary' : 'outline'}>
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card className="glass-card border-gradient animate-slide-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Scans ({scanHistory.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanHistory.map((scan, index) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover-3d-lift animate-slide-in-up"
                  style={{animationDelay: `${index * 30}ms`}}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      scan.found ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {scan.found ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{scan.barcode}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(scan.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={scan.found ? "default" : "destructive"} className="text-xs">
                    {scan.found ? `${scan.results} found` : 'Not found'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedBarcodeScanner;
