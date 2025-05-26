
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { QrCode } from "lucide-react";

const Barcodes = () => {
  return (
    <AdminLayout>
      <div className="p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <QrCode className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Barcode Management</h1>
        </div>
        <p className="text-muted-foreground">Barcode generation and management tools will be implemented here.</p>
      </div>
    </AdminLayout>
  );
};

export default Barcodes;
