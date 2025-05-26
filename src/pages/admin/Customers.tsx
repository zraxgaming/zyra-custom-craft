
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CustomerAnalytics from "@/components/admin/CustomerAnalytics";

const Customers = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            View and manage your customers
          </p>
        </div>
        <CustomerAnalytics />
      </div>
    </AdminLayout>
  );
};

export default Customers;
