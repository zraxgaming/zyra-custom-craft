
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import EnhancedBarcodeScanner from "@/components/barcode/EnhancedBarcodeScanner";

const AdminBarcodeScanner = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Barcode Scanner</h1>
        <EnhancedBarcodeScanner />
      </div>
    </AdminLayout>
  );
};

export default AdminBarcodeScanner;
