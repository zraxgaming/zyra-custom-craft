
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, Package, ShoppingCart, QrCode, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BarcodeScanner = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
        setIsScanning(true);
        
        toast({
          title: "Camera Started",
          description: "Position barcode in front of camera",
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions or try manual entry.",
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

  const searchByBarcode = async (barcode: string) => {
    if (!barcode.trim()) return;
    
    setIsLoading(true);
    try {
      // Search in products by barcode
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode);

      if (productsError) throw productsError;

      // Search in products by ID (if barcode looks like UUID)
      const { data: productsById, error: productsByIdError } = await supabase
        .from('products')
        .select('*')
        .eq('id', barcode);

      if (productsByIdError) throw productsByIdError;

      // Search in orders by ID
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (first_name, last_name, email)
        `)
        .eq('id', barcode);

      if (ordersError) throw ordersError;

      const allProducts = [...(products || []), ...(productsById || [])];
      const results = [
        ...allProducts.map(p => ({ ...p, type: 'product' })),
        ...(orders || []).map(o => ({ ...o, type: 'order' }))
      ];

      setSearchResults(results);

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
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Section */}
          <div className="text-center">
            {!isScanning ? (
              <div className="space-y-4">
                <div className="w-full max-w-md h-64 bg-muted rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Camera not active</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={startScanning} className="bg-gradient-to-r from-primary to-purple-600">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                  <Button variant="outline" onClick={simulateScan}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Demo Scan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md h-64 bg-black rounded-lg mx-auto border-2 border-primary"
                />
                <div className="flex gap-2 justify-center">
                  <Button variant="destructive" onClick={stopScanning}>
                    Stop Camera
                  </Button>
                  <Button variant="outline" onClick={simulateScan}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Demo Scan
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Manual Entry Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px bg-border flex-1"></div>
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="h-px bg-border flex-1"></div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manual-barcode">Enter Barcode Manually</Label>
              <div className="flex gap-2">
                <Input
                  id="manual-barcode"
                  placeholder="Enter barcode or product ID..."
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                />
                <Button onClick={handleManualSearch} disabled={!manualBarcode.trim()}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Last Scanned */}
          {scannedData && (
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Last Scanned:</p>
              <p className="font-mono text-lg text-green-900 dark:text-green-100">{scannedData}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Searching database...</p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
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
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {item.type === 'product' ? (
                        <Package className="h-5 w-5 text-primary" />
                      ) : (
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {item.type === 'product' ? item.name : `Order #${item.id.slice(-8)}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.type === 'product' 
                          ? `$${item.price} - Stock: ${item.stock_quantity || 0}`
                          : `${item.profiles?.first_name || ''} ${item.profiles?.last_name || ''} - $${item.total_amount}`
                        }
                      </p>
                      {item.barcode && (
                        <p className="text-xs text-muted-foreground font-mono">
                          Barcode: {item.barcode}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={item.type === 'product' ? 'default' : 'secondary'}>
                    {item.type}
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

export default BarcodeScanner;
