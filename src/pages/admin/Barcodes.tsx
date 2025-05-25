
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import BarcodeDisplay from "@/components/barcode/BarcodeDisplay";
import { Plus, Download, Eye } from "lucide-react";
import { format } from "date-fns";

interface BarcodeGeneration {
  id: string;
  barcode_type: string;
  barcode_data: string;
  generated_by: string | null;
  created_at: string;
  product_id: string | null;
}

interface Product {
  id: string;
  name: string;
  sku: string;
}

const Barcodes = () => {
  const { user } = useAuth();
  const [barcodes, setBarcodes] = useState<BarcodeGeneration[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState<BarcodeGeneration | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    barcode_type: "qr" as "qr" | "code128" | "ean13",
    barcode_data: "",
    product_id: "",
  });

  useEffect(() => {
    fetchBarcodes();
    fetchProducts();
  }, []);

  const fetchBarcodes = async () => {
    try {
      const { data, error } = await supabase
        .from("barcode_generations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBarcodes(data || []);
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

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku")
        .eq("status", "published");

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      barcode_type: "qr",
      barcode_data: "",
      product_id: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const barcodeData = {
        barcode_type: formData.barcode_type,
        barcode_data: formData.barcode_data,
        generated_by: user?.id || null,
        product_id: formData.product_id || null,
      };

      const { error } = await supabase
        .from("barcode_generations")
        .insert(barcodeData);

      if (error) throw error;

      toast({
        title: "Barcode generated",
        description: "New barcode has been generated successfully.",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchBarcodes();
    } catch (error: any) {
      toast({
        title: "Error generating barcode",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleView = (barcode: BarcodeGeneration) => {
    setSelectedBarcode(barcode);
    setViewDialogOpen(true);
  };

  const downloadBarcode = (barcode: BarcodeGeneration) => {
    // This would typically convert the barcode to an image and download it
    toast({
      title: "Download started",
      description: "Barcode download will begin shortly.",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Barcode Generator</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Generate Barcode
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Generate New Barcode</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="barcode_type" className="text-foreground">Barcode Type</Label>
                  <Select 
                    value={formData.barcode_type} 
                    onValueChange={(value: "qr" | "code128" | "ean13") => 
                      setFormData({ ...formData, barcode_type: value })
                    }
                  >
                    <SelectTrigger className="bg-background text-foreground border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="qr">QR Code</SelectItem>
                      <SelectItem value="code128">Code 128</SelectItem>
                      <SelectItem value="ean13">EAN-13</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="barcode_data" className="text-foreground">Barcode Data</Label>
                  <Input
                    id="barcode_data"
                    value={formData.barcode_data}
                    onChange={(e) => setFormData({ ...formData, barcode_data: e.target.value })}
                    placeholder="Enter data to encode"
                    required
                    className="bg-background text-foreground border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="product_id" className="text-foreground">Link to Product (Optional)</Label>
                  <Select 
                    value={formData.product_id} 
                    onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                  >
                    <SelectTrigger className="bg-background text-foreground border-border">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="">No product</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} {product.sku && `(${product.sku})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="text-foreground border-border">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    Generate
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Generated Barcodes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-foreground">Type</TableHead>
                    <TableHead className="text-foreground">Data</TableHead>
                    <TableHead className="text-foreground">Product</TableHead>
                    <TableHead className="text-foreground">Generated</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barcodes.map((barcode) => (
                    <TableRow key={barcode.id} className="border-border">
                      <TableCell className="text-foreground uppercase">{barcode.barcode_type}</TableCell>
                      <TableCell className="text-foreground font-mono">
                        {barcode.barcode_data.length > 30 
                          ? `${barcode.barcode_data.substring(0, 30)}...` 
                          : barcode.barcode_data
                        }
                      </TableCell>
                      <TableCell className="text-foreground">
                        {barcode.product_id 
                          ? products.find(p => p.id === barcode.product_id)?.name || "Unknown"
                          : "None"
                        }
                      </TableCell>
                      <TableCell className="text-foreground">
                        {format(new Date(barcode.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(barcode)}
                            className="text-foreground hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => downloadBarcode(barcode)}
                            className="text-foreground hover:bg-muted"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Barcode Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">View Barcode</DialogTitle>
            </DialogHeader>
            {selectedBarcode && (
              <div className="flex flex-col items-center space-y-4">
                <BarcodeDisplay
                  type={selectedBarcode.barcode_type as "qr" | "code128" | "ean13"}
                  data={selectedBarcode.barcode_data}
                />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Type: {selectedBarcode.barcode_type.toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">Data: {selectedBarcode.barcode_data}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Barcodes;
