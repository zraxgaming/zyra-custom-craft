
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Square, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EnhancedBarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

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
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsScanning(false);
    }
  };

  const handleManualInput = (value: string) => {
    setScannedData(value);
    if (value) {
      toast({
        title: "Barcode Detected",
        description: `Scanned: ${value}`,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Barcode Scanner
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
              <div className="absolute inset-0 flex items-center justify-center">
                <Square className="h-32 w-32 text-red-500 opacity-50" />
              </div>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Camera preview will appear here</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isScanning ? (
            <Button onClick={startScanning} className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Start Scanning
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="destructive" className="flex-1">
              <Square className="mr-2 h-4 w-4" />
              Stop Scanning
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Manual Input:</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter barcode manually"
              className="flex-1 px-3 py-2 border rounded-md"
              value={scannedData}
              onChange={(e) => handleManualInput(e.target.value)}
            />
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {scannedData && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800">Scanned Result:</h4>
            <p className="text-green-700">{scannedData}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedBarcodeScanner;
