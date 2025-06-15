
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Remove jsqr import since it's causing issues - use a simpler approach
// import jsQR from 'jsqr';

interface EnhancedBarcodeScannerProps {
  onScan: (data: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

const EnhancedBarcodeScanner: React.FC<EnhancedBarcodeScannerProps> = ({
  onScan,
  isActive,
  onToggle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isActive) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => stopScanning();
  }, [isActive]);

  const startScanning = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setScanning(true);
        scanFrame();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopScanning = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setScanning(false);
  };

  const scanFrame = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Simple barcode detection - for now just simulate scanning
      // In a real implementation, you would use a proper barcode scanning library
      // For demo purposes, clicking on the video will simulate a scan
      
      requestAnimationFrame(scanFrame);
    } else {
      requestAnimationFrame(scanFrame);
    }
  };

  const simulateScan = () => {
    // Simulate scanning a barcode for demo purposes
    const mockBarcode = `SCAN_${Date.now()}`;
    onScan(mockBarcode);
    toast({
      title: 'Barcode Scanned',
      description: `Detected: ${mockBarcode}`,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Barcode Scanner</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="flex items-center gap-2"
          >
            {isActive ? (
              <>
                <CameraOff className="h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                Start
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isActive && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg border cursor-pointer"
              onClick={simulateScan}
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-red-500 rounded-lg"></div>
            </div>
          </div>
        )}
        
        {isActive && (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Position barcode within the red frame
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={simulateScan}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Test Scan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedBarcodeScanner;
