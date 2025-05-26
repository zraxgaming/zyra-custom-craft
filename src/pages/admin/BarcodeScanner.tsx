
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import EnhancedBarcodeScanner from "@/components/barcode/EnhancedBarcodeScanner";
import { Badge } from "@/components/ui/badge";
import { Scan, Sparkles } from "lucide-react";

const AdminBarcodeScanner = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative mb-8">
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                <Scan className="h-5 w-5 mr-3" />
                Barcode Scanner
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
              Scanner
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
              Scan barcodes to find products, orders, and track items instantly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <EnhancedBarcodeScanner />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBarcodeScanner;
