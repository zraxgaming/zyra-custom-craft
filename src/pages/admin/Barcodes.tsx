
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Package, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import BarcodeGenerator from "@/components/admin/BarcodeGenerator";
import BarcodeDisplay from "@/components/barcode/BarcodeDisplay";
import BarcodeDownloader from "@/components/barcode/BarcodeDownloader";
import { EnhancedLoader } from "@/components/ui/enhanced-loader";

interface BarcodeGeneration {
  id: string;
  product_id: string;
  barcode_type: string;
  barcode_data: string;
  created_at: string;
}

const AdminBarcodes = () => {
  const [barcodes, setBarcodes] = useState<BarcodeGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBarcodes();
  }, []);

  const fetchBarcodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('barcode_generations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBarcodes(data || []);
    } catch (error) {
      console.error('Error fetching barcodes:', error);
      toast({
        title: "Error",
        description: "Failed to load barcodes",
        variant: "destructive",
      });
      setError("Failed to load barcodes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold animate-slide-in-left flex items-center">
            <QrCode className="h-8 w-8 mr-3" />
            Barcode Management
          </h1>
        </div>
        <BarcodeGenerator />
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Recent Barcodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 min-h-[160px]">
              {loading ? (
                <EnhancedLoader message="Loading barcodes..." className="py-12" />
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : (barcodes.length === 0 ? (
                <div className="text-center py-8">
                  <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Barcodes Generated</h3>
                  <p className="text-muted-foreground">
                    Use the generator above to create your first barcode.
                  </p>
                </div>
              ) : (
                barcodes.map((barcode, index) => (
                  <div 
                    key={barcode.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in-up"
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-24">
                        {barcode.barcode_data && barcode.barcode_type ? (
                          <BarcodeDisplay 
                            data={barcode.barcode_data} 
                            type={barcode.barcode_type}
                            width={120}
                            height={60} 
                            className="bg-white"
                          />
                        ) : (
                          <div className="bg-gray-100 p-6 rounded">
                            <Package className="h-10 w-10 text-gray-400 mx-auto" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{barcode.barcode_data || "N/A"}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span>Product ID: {barcode.product_id || 'N/A'}</span>
                          <Calendar className="h-4 w-4 ml-4" />
                          <span>{barcode.created_at ? new Date(barcode.created_at).toLocaleDateString() : "Unknown date"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {barcode.barcode_type?.toUpperCase() ?? "N/A"}
                      </Badge>
                      {barcode.barcode_data && barcode.barcode_type ? (
                        <BarcodeDownloader
                          data={barcode.barcode_data}
                          type={barcode.barcode_type}
                          filename={`barcode-${barcode.id}`}
                        />
                      ) : null}
                    </div>
                  </div>
                ))
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBarcodes;
