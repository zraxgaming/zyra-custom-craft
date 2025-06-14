
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductManager from "@/components/admin/ProductManager";
import SEOHead from "@/components/seo/SEOHead";

const AdminProducts = () => {
  return (
    <>
      <SEOHead 
        title="Products Management - Admin Dashboard"
        description="Manage your product catalog, inventory, and pricing from the admin dashboard."
      />
      <AdminLayout>
        <ProductManager />
      </AdminLayout>
    </>
  );
};

export default AdminProducts;
