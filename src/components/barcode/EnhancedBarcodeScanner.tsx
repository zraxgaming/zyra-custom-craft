
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, Package, ShoppingCart, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EnhancedBarcodeScanner = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanning = async () => {
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
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const searchByBarcode = async (barcode: string) => {
    setIsLoading(true);
    try {
      // Search in products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode);

      if (productsError) throw productsError;

      // Search in orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (first_name, last_name, email)
        `)
        .eq('id', barcode);

      if (ordersError) throw ordersError;

      const results = [
        ...products.map(p => ({ ...p, type: 'product' })),
        ...orders.map(o => ({ ...o, type: 'order' }))
      ];

      setSearchResults(results);

      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No items found for this barcode.",
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

  const handleScanResult = (result: string) => {
    setScannedData(result);
    stopScanning();
    searchByBarcode(result);
  };

  // Simulate barcode detection for demo
  const simulateScan = () => {
    const sampleBarcodes = [
      '1234567890',
      '9876543210',
      'PROD001',
      'ORDER123'
    ];
    const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
    handleScanResult(randomBarcode);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {!isScanning ? (
              <div className="space-y-4">
                <div className="w-64 h-48 bg-muted rounded-lg mx-auto flex items-center justify-center">
                  <Camera className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="space-x-2">
                  <Button onClick={startScanning}>
                    <Camera className="h-4 w-4 mr-2" />
                    Start Scanning
                  </Button>
                  <Button variant="outline" onClick={simulateScan}>
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
                  className="w-64 h-48 bg-black rounded-lg mx-auto"
                />
                <Button variant="destructive" onClick={stopScanning}>
                  Stop Scanning
                </Button>
              </div>
            )}
          </div>

          {scannedData && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm font-medium">Last Scanned:</p>
              <p className="font-mono text-lg">{scannedData}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Searching...</p>
          </CardContent>
        </Card>
      )}

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
                          ? `$${item.price} - Stock: ${item.stock_quantity}`
                          : `${item.profiles?.first_name} ${item.profiles?.last_name} - $${item.total_amount}`
                        }
                      </p>
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

export default EnhancedBarcodeScanner;
