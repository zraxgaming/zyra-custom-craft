
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Scan, Package } from "lucide-react";

interface ScannedBarcode {
  id: string;
  barcode_data: string;
  barcode_type: string;
  product_id?: string;
  created_at: string;
}

const BarcodeScanner = () => {
  const { user } = useAuth();
  const [scannedBarcodes, setScannedBarcodes] = useState<ScannedBarcode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchScannedBarcodes();
  }, []);

  const fetchScannedBarcodes = async () => {
    try {
      const { data, error } = await supabase
        .from("barcode_generations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setScannedBarcodes(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching barcodes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateScan = async () => {
    // Simulate scanning a barcode
    const mockBarcodeData = `SCAN_${Date.now()}`;
    
    try {
      const { error } = await supabase
        .from("barcode_generations")
        .insert({
          barcode_type: "qr",
          barcode_data: mockBarcodeData,
          generated_by: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Barcode scanned",
        description: "Mock barcode has been scanned successfully.",
      });

      fetchScannedBarcodes();
    } catch (error: any) {
      toast({
        title: "Error scanning barcode",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Barcode Scanner</h1>
          <Button onClick={simulateScan} className="bg-primary text-primary-foreground">
            <Scan className="mr-2 h-4 w-4" />
            Simulate Scan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Scan className="h-5 w-5" />
                Scanner View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Scan className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Camera view would appear here</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    This is a mock interface
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Package className="h-5 w-5" />
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {scannedBarcodes.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No barcodes scanned yet
                    </p>
                  ) : (
                    scannedBarcodes.map((barcode) => (
                      <div
                        key={barcode.id}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-mono text-sm text-foreground">
                              {barcode.barcode_data}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {barcode.barcode_type.toUpperCase()}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(barcode.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Scanner Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• Point the camera at a barcode or QR code</p>
              <p>• Ensure good lighting for better scan accuracy</p>
              <p>• Hold steady until the scan is complete</p>
              <p>• Scanned codes will appear in the recent scans list</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BarcodeScanner;
