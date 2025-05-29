
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Camera, Scan, StopCircle, History, Package } from 'lucide-react';

const EnhancedBarcodeScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const [lastScanned, setLastScanned] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startScanning = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      
      // Simulate barcode detection for demo
      // In a real implementation, you would use a barcode detection library
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // Random detection simulation
          const mockBarcode = `BC${Date.now().toString().slice(-6)}`;
          handleBarcodeDetected(mockBarcode);
          clearInterval(interval);
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(interval);
      }, 10000);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const handleBarcodeDetected = (barcode: string) => {
    setLastScanned(barcode);
    setScannedCodes(prev => [barcode, ...prev.slice(0, 9)]); // Keep last 10 scans
    
    toast({
      title: "Barcode Detected!",
      description: `Scanned: ${barcode}`,
    });
    
    stopScanning();
  };

  const handleManualInput = () => {
    const input = prompt('Enter barcode manually:');
    if (input) {
      handleBarcodeDetected(input);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Scan className="h-6 w-6 text-primary" />
            Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera View */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden animate-slide-in-up">
            {isScanning ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center animate-pulse">
                  <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Camera feed will appear here</p>
                </div>
              </div>
            )}
            
            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-40 border-2 border-primary rounded-lg relative animate-pulse">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-primary animate-scan"></div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            {!isScanning ? (
              <Button onClick={startScanning} size="lg" className="hover:scale-105 transition-transform">
                <Camera className="h-5 w-5 mr-2" />
                Start Scanning
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="outline" size="lg" className="hover:scale-105 transition-transform">
                <StopCircle className="h-5 w-5 mr-2" />
                Stop Scanning
              </Button>
            )}
            <Button onClick={handleManualInput} variant="outline" size="lg" className="hover:scale-105 transition-transform">
              Manual Input
            </Button>
          </div>

          {/* Last Scanned */}
          {lastScanned && (
            <Card className="bg-primary/5 border-primary/20 animate-scale-in">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary">Last Scanned</p>
                    <p className="text-lg font-mono">{lastScanned}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <Package className="h-4 w-4 mr-1" />
                    Success
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Scan History */}
      {scannedCodes.length > 0 && (
        <Card className="animate-slide-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <History className="h-5 w-5" />
              Recent Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {scannedCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors animate-slide-in-right"
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <span className="font-mono text-sm">{code}</span>
                  <Badge variant="outline" className="text-xs">
                    {index === 0 ? 'Latest' : `${index + 1}`}
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
