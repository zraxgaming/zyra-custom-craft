
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BarcodeGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    barcode_type: 'qr',
    barcode_data: '',
  });
  const [generatedBarcode, setGeneratedBarcode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate barcode data
      const barcodeValue = formData.barcode_data || `PRODUCT_${Date.now()}`;
      
      // Save to database
      const { data, error } = await supabase
        .from('barcode_generations')
        .insert({
          product_id: formData.product_id || null,
          barcode_type: formData.barcode_type,
          barcode_data: barcodeValue,
        })
        .select()
        .single();

      if (error) throw error;

      // For demo purposes, create a simple barcode representation
      setGeneratedBarcode(barcodeValue);

      toast({
        title: "Success",
        description: "Barcode generated successfully",
      });
    } catch (error: any) {
      console.error('Error generating barcode:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate barcode",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedBarcode) return;
    
    // Create a simple download for the barcode data
    const element = document.createElement("a");
    const file = new Blob([`Barcode: ${generatedBarcode}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `barcode_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generate Barcode</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <Label htmlFor="product_id">Product ID (Optional)</Label>
              <Input
                id="product_id"
                value={formData.product_id}
                onChange={(e) => setFormData(prev => ({ ...prev, product_id: e.target.value }))}
                placeholder="Enter product ID"
              />
            </div>

            <div>
              <Label htmlFor="barcode_type">Barcode Type</Label>
              <Select
                value={formData.barcode_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, barcode_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qr">QR Code</SelectItem>
                  <SelectItem value="barcode">Barcode</SelectItem>
                  <SelectItem value="code128">Code 128</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="barcode_data">Barcode Data</Label>
              <Input
                id="barcode_data"
                value={formData.barcode_data}
                onChange={(e) => setFormData(prev => ({ ...prev, barcode_data: e.target.value }))}
                placeholder="Enter data to encode (optional)"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              {loading ? "Generating..." : "Generate Barcode"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedBarcode && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Barcode</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <QrCode className="h-24 w-24 mx-auto text-gray-400" />
              <p className="mt-4 text-sm text-muted-foreground">
                Barcode: {generatedBarcode}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => window.print()} variant="outline" className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BarcodeGenerator;
