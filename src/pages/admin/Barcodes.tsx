import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast";
import { Download, Copy } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import Barcode from 'react-barcode';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface BarcodeData {
  id: string;
  product_name: string;
  barcode: string;
}

interface BarcodeDownloaderProps {
  barcodeData: string;
  type: string;
  filename: string;
}

const BarcodeDownloader: React.FC<BarcodeDownloaderProps> = ({ barcodeData, type, filename }) => {
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(`Barcode for ${filename}`, 10, 10);

    // Generate barcode as SVG and then render it to Canvas
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    Barcode(svgElement, barcodeData, { format: type.toUpperCase() });

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 15, 30, 180, 40); // Adjust position and size as needed
      doc.save(`${filename}.pdf`);
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  );
};

const AdminBarcodes = () => {
  const [barcodeData, setBarcodeData] = useState<BarcodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBarcode, setNewBarcode] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchBarcodeData();
  }, []);

  const fetchBarcodeData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('barcodes')
        .select('*');

      if (error) {
        throw error;
      }

      setBarcodeData(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBarcode = async () => {
    if (!newBarcode || !newProductName) {
      toast({
        title: "Error",
        description: "Please enter both barcode and product name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('barcodes')
        .insert([{ barcode: newBarcode, product_name: newProductName }])
        .select();

      if (error) {
        throw error;
      }

      setBarcodeData([...barcodeData, ...(data || [])]);
      setNewBarcode('');
      setNewProductName('');

      toast({
        title: "Success",
        description: "Barcode added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyBarcode = (barcode: string) => {
    navigator.clipboard.writeText(barcode);
    toast({
      title: "Copied",
      description: "Barcode copied to clipboard.",
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-5">Barcode Management</h1>

        {/* Add Barcode Form */}
        <Card className="mb-5">
          <CardContent>
            <h2 className="text-xl font-semibold mb-3">Add New Barcode</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  type="text"
                  id="productName"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="barcodeValue">Barcode Value</Label>
                <Input
                  type="text"
                  id="barcodeValue"
                  value={newBarcode}
                  onChange={(e) => setNewBarcode(e.target.value)}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={addBarcode}>Add Barcode</Button>
          </CardContent>
        </Card>

        {/* Barcode List */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-3">Existing Barcodes</h2>
            {loading ? (
              <p>Loading barcodes...</p>
            ) : (
              <Table>
                <TableCaption>A list of your barcodes.</TableCaption>
                <TableHead>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Barcode</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {barcodeData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell className="font-mono">{item.barcode}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => copyBarcode(item.barcode)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <BarcodeDownloader barcodeData={item.barcode} type="CODE128" filename={item.product_name} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBarcodes;
