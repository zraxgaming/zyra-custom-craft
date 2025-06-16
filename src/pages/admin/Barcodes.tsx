
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

interface BarcodeData {
  id: string;
  barcode_data: string;
  barcode_type: string;
  product_id?: string;
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
    doc.text(barcodeData, 10, 30);
    doc.save(`${filename}.pdf`);
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Download PDF
    </Button>
  );
};

const AdminBarcodes = () => {
  const [barcodeData, setBarcodeData] = useState<BarcodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBarcode, setNewBarcode] = useState('');
  const [newBarcodeType, setNewBarcodeType] = useState('CODE128');
  const { toast } = useToast();

  useEffect(() => {
    fetchBarcodeData();
  }, []);

  const fetchBarcodeData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('barcode_generations')
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
    if (!newBarcode) {
      toast({
        title: "Error",
        description: "Please enter barcode data.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('barcode_generations')
        .insert([{ 
          barcode_data: newBarcode, 
          barcode_type: newBarcodeType 
        }])
        .select();

      if (error) {
        throw error;
      }

      setBarcodeData([...barcodeData, ...(data || [])]);
      setNewBarcode('');

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

        <Card className="mb-5">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3">Add New Barcode</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="barcodeValue">Barcode Data</Label>
                <Input
                  type="text"
                  id="barcodeValue"
                  value={newBarcode}
                  onChange={(e) => setNewBarcode(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="barcodeType">Barcode Type</Label>
                <select 
                  id="barcodeType"
                  value={newBarcodeType}
                  onChange={(e) => setNewBarcodeType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="CODE128">CODE128</option>
                  <option value="CODE39">CODE39</option>
                  <option value="EAN13">EAN13</option>
                </select>
              </div>
            </div>
            <Button className="mt-4" onClick={addBarcode}>Add Barcode</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3">Existing Barcodes</h2>
            {loading ? (
              <p>Loading barcodes...</p>
            ) : (
              <Table>
                <TableCaption>A list of your barcodes.</TableCaption>
                <TableHead>
                  <TableRow>
                    <TableHead>Barcode Data</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {barcodeData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.barcode_data}</TableCell>
                      <TableCell>{item.barcode_type}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => copyBarcode(item.barcode_data)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <BarcodeDownloader 
                          barcodeData={item.barcode_data} 
                          type={item.barcode_type} 
                          filename={`barcode-${item.id}`} 
                        />
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
