
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import InventoryManager from "@/components/admin/InventoryManager";
import SEOHead from "@/components/seo/SEOHead";

const AdminInventory = () => {
  return (
    <>
      <SEOHead 
        title="Inventory Management - Admin Dashboard"
        description="Track and manage your product inventory, stock levels, and warehouse operations."
      />
      <AdminLayout>
        <InventoryManager />
      </AdminLayout>
    </>
  );
};

export default AdminInventory;
