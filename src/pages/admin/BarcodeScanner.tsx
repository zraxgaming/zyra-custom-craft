
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Camera, Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would use a barcode/QR reading library
      // For now, we'll simulate the scanning
      toast({
        title: "File uploaded",
        description: "Barcode scanning functionality would process this image",
      });
    }
  };

  const handleManualEntry = () => {
    if (scannedData.trim()) {
      toast({
        title: "Barcode processed",
        description: `Scanned data: ${scannedData}`,
      });
      // Here you would lookup the product or order by the scanned data
    }
  };

  const startCameraScanning = () => {
    setIsScanning(true);
    // In a real implementation, you would access the camera and use a barcode scanning library
    toast({
      title: "Camera scanning",
      description: "Camera barcode scanning would start here",
    });
    setTimeout(() => {
      setIsScanning(false);
      setScannedData("123456789012"); // Simulated scan result
    }, 2000);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Barcode Scanner</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Scan Barcode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={startCameraScanning}
                disabled={isScanning}
                className="w-full bg-primary text-primary-foreground"
              >
                <Camera className="mr-2 h-4 w-4" />
                {isScanning ? "Scanning..." : "Start Camera Scan"}
              </Button>
              
              <div className="text-center text-muted-foreground">or</div>
              
              <div>
                <Label htmlFor="barcode-file" className="text-foreground">Upload Barcode Image</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="barcode-file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full text-foreground border-border"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Image
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-muted-foreground">or</div>
              
              <div>
                <Label htmlFor="manual-entry" className="text-foreground">Manual Entry</Label>
                <div className="mt-2 flex space-x-2">
                  <Input
                    id="manual-entry"
                    value={scannedData}
                    onChange={(e) => setScannedData(e.target.value)}
                    placeholder="Enter barcode manually"
                    className="bg-background text-foreground border-border"
                  />
                  <Button onClick={handleManualEntry} className="bg-primary text-primary-foreground">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Scan Results</CardTitle>
            </CardHeader>
            <CardContent>
              {scannedData ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground">Scanned Data:</Label>
                    <div className="mt-1 p-2 bg-muted rounded border font-mono text-sm">
                      {scannedData}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-foreground">Actions:</Label>
                    <div className="mt-2 space-y-2">
                      <Button variant="outline" className="w-full text-foreground border-border">
                        Lookup Product
                      </Button>
                      <Button variant="outline" className="w-full text-foreground border-border">
                        Lookup Order
                      </Button>
                      <Button variant="outline" className="w-full text-foreground border-border">
                        Add to Inventory
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No barcode scanned yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BarcodeScanner;
