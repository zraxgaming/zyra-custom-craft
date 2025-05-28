
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BarcodeGenerator from "@/components/admin/BarcodeGenerator";

const AdminBarcodes = () => {
  return (
    <AdminLayout>
      <BarcodeGenerator />
    </AdminLayout>
  );
};

export default AdminBarcodes;
