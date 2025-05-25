
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { QrCode, Barcode, Download, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import BarcodeGenerator from "@/components/barcode/BarcodeGenerator";
import QRGenerator from "@/components/barcode/QRGenerator";

const BarcodeManager = () => {
  const [barcodes, setBarcodes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    product_id: "",
    barcode_type: "qr",
    barcode_data: ""
  });

  useEffect(() => {
    fetchBarcodes();
    fetchProducts();
  }, []);

  const fetchBarcodes = async () => {
    try {
      const { data, error } = await supabase
        .from("barcode_generations")
        .select(`
          *,
          products!barcode_generations_product_id_fkey (
            id,
            name,
            sku
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBarcodes(data || []);
    } catch (error: any) {
      console.error("Error fetching barcodes:", error);
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
        .eq("status", "published")
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("barcode_generations")
        .insert({
          product_id: formData.product_id || null,
          barcode_type: formData.barcode_type,
          barcode_data: formData.barcode_data
        });

      if (error) throw error;

      toast({
        title: "Barcode generated",
        description: "The barcode has been generated successfully.",
      });

      fetchBarcodes();
      setIsDialogOpen(false);
      setFormData({
        product_id: "",
        barcode_type: "qr",
        barcode_data: ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this barcode?")) return;
    
    try {
      const { error } = await supabase
        .from("barcode_generations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Barcode deleted",
        description: "The barcode has been deleted successfully.",
      });

      fetchBarcodes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadBarcode = (data: string, type: string, filename: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (type === 'qr') {
      // Generate QR code and download
      import('qrcode').then(QRCode => {
        QRCode.toCanvas(canvas, data, (error) => {
          if (error) {
            toast({
              title: "Error",
              description: "Failed to generate QR code",
              variant: "destructive",
            });
            return;
          }
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${filename}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          });
        });
      });
    } else {
      // Generate barcode and download
      import('jsbarcode').then(({ default: JsBarcode }) => {
        try {
          JsBarcode(canvas, data, {
            format: "CODE128",
            width: 2,
            height: 100,
            displayValue: true
          });
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${filename}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to generate barcode",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Barcode Manager</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Barcode
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate New Barcode</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="product_id">Product (Optional)</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => 
                      setFormData({ ...formData, product_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No product</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} {product.sku && `(${product.sku})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="barcode_type">Barcode Type</Label>
                  <Select
                    value={formData.barcode_type}
                    onValueChange={(value) => 
                      setFormData({ ...formData, barcode_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qr">QR Code</SelectItem>
                      <SelectItem value="barcode">Barcode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="barcode_data">Data</Label>
                  <Input
                    id="barcode_data"
                    value={formData.barcode_data}
                    onChange={(e) => setFormData({ ...formData, barcode_data: e.target.value })}
                    placeholder="Enter data to encode"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Generate Barcode
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QRGenerator />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Barcode className="h-5 w-5" />
                Barcode Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarcodeGenerator />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Generated Barcodes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : barcodes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  No barcodes generated yet.
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {barcodes.map((barcode) => (
                      <TableRow key={barcode.id}>
                        <TableCell>
                          {barcode.products?.name || "No product"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {barcode.barcode_type === 'qr' ? (
                              <QrCode className="h-4 w-4" />
                            ) : (
                              <Barcode className="h-4 w-4" />
                            )}
                            {barcode.barcode_type.toUpperCase()}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {barcode.barcode_data}
                        </TableCell>
                        <TableCell>
                          {new Date(barcode.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => downloadBarcode(
                                barcode.barcode_data,
                                barcode.barcode_type,
                                `${barcode.barcode_type}-${barcode.id.substring(0, 8)}`
                              )}
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(barcode.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BarcodeManager;
