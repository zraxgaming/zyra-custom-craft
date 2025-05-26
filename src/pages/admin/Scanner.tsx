
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ScanLine } from "lucide-react";

const Scanner = () => {
  return (
    <AdminLayout>
      <div className="p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ScanLine className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Barcode Scanner</h1>
        </div>
        <p className="text-muted-foreground">Barcode scanning functionality will be implemented here.</p>
      </div>
    </AdminLayout>
  );
};

export default Scanner;
