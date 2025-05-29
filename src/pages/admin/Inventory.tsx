
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import InventoryManager from "@/components/admin/InventoryManager";

const AdminInventory = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-glow">
            Inventory Management
          </h1>
        </div>
        <InventoryManager />
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
