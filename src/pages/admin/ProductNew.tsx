
import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const ProductNew = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/admin/products");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Product</h1>
            <p className="text-muted-foreground">Add a new product to your store</p>
          </div>
        </div>

        <ProductForm onSuccess={handleSuccess} />
      </div>
    </AdminLayout>
  );
};

export default ProductNew;
