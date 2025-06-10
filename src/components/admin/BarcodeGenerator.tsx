
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Printer, QrCode, Package, Camera, ScanLine } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import ProductSearchSelect from './ProductSearchSelect';

interface BarcodeGeneratorProps {
  onScanComplete?: (barcode: string) => void;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ onScanComplete }) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const generateBarcode = () => {
    if (!selectedProduct || !canvasRef.current) return;

    try {
      JsBarcode(canvasRef.current, selectedProduct.barcode, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true
      });
      
      toast({
        title: "Barcode Generated! 📊",
        description: `Barcode created for ${selectedProduct.name}`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate barcode",
        variant: "destructive"
      });
    }
  };

  const printBarcode = () => {
    if (!canvasRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    
    printWindow.document.write(`
      <html>
        <head><title>Print Barcode</title></head>
        <body style="margin: 0; padding: 20px; text-align: center;">
          <h3>${selectedProduct?.name || 'Product Barcode'}</h3>
          <img src="${dataURL}" style="max-width: 100%;" />
          <p>${selectedProduct?.barcode || ''}</p>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const startScanning = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      toast({
        title: "Camera Active 📷",
        description: "Point camera at barcode to scan",
      });
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera permission to scan barcodes",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const simulateScan = () => {
    // Simulate a scan for demo purposes
    const demoBarcode = selectedProduct?.barcode || '1234567890123';
    setScanResult(demoBarcode);
    if (onScanComplete) {
      onScanComplete(demoBarcode);
    }
    toast({
      title: "Barcode Scanned! ✅",
      description: `Scanned: ${demoBarcode}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800 animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <div className="p-2 bg-purple-600 rounded-lg">
              <QrCode className="h-5 w-5 text-white animate-pulse" />
            </div>
            Barcode Generator & Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 animate-bounce" />
              Select Product
            </h3>
            <ProductSearchSelect
              onSelect={setSelectedProduct}
              selectedProduct={selectedProduct}
              placeholder="Search product to generate barcode..."
            />
          </div>

          {selectedProduct && (
            <div className="space-y-4 animate-slide-in-up">
              <div className="flex gap-2">
                <Button
                  onClick={generateBarcode}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate Barcode
                </Button>
                <Button
                  onClick={printBarcode}
                  variant="outline"
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto animate-fade-in"
                />
              </div>
            </div>
          )}

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Camera className="h-4 w-4 animate-pulse" />
              Barcode Scanner
            </h3>
            
            <div className="flex gap-2">
              {!isScanning ? (
                <Button
                  onClick={startScanning}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              ) : (
                <Button
                  onClick={stopScanning}
                  variant="destructive"
                >
                  <ScanLine className="h-4 w-4 mr-2" />
                  Stop Scanning
                </Button>
              )}
              
              <Button
                onClick={simulateScan}
                variant="outline"
                className="hover:scale-105 transition-transform duration-300"
              >
                <ScanLine className="h-4 w-4 mr-2" />
                Simulate Scan
              </Button>
            </div>

            {isScanning && (
              <div className="bg-black rounded-lg overflow-hidden animate-scale-in">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  autoPlay
                  playsInline
                />
                <div className="absolute inset-0 border-2 border-red-500 pointer-events-none animate-pulse">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-1 bg-red-500 animate-pulse"></div>
                </div>
              </div>
            )}

            {scanResult && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-bounce-in">
                <p className="font-semibold text-green-700 dark:text-green-300">
                  Scanned: {scanResult}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeGenerator;
