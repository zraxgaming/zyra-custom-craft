
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Square } from "lucide-react";

interface CameraScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera if available
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError("Camera access denied or not available");
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const captureFrame = () => {
    // Simulate barcode detection - in a real app, you'd use a barcode scanning library
    const simulatedBarcode = `${Date.now()}`;
    onScan(simulatedBarcode);
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-black text-white">
        <h2 className="text-lg font-semibold">Scan Barcode</h2>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <div className="flex-1 relative">
        {error ? (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-4">{error}</p>
              <Button onClick={startCamera}>Try Again</Button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Square className="h-48 w-48 text-white opacity-50" strokeWidth={2} />
                <div className="absolute inset-0 border-2 border-red-500 rounded-lg"></div>
              </div>
            </div>
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Button
                onClick={captureFrame}
                disabled={!isScanning}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full"
              >
                Scan
              </Button>
            </div>
          </>
        )}
      </div>
      
      <div className="p-4 bg-black text-white text-center">
        <p className="text-sm opacity-75">
          Position the barcode within the frame and tap Scan
        </p>
      </div>
    </div>
  );
};

export default CameraScanner;
