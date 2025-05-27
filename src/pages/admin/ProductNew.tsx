
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

const ProductNew = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/products');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/products')}
              className="animate-slide-in-left"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
            <h1 className="text-3xl font-bold animate-slide-in-right flex items-center">
              <Plus className="h-8 w-8 mr-3" />
              Add New Product
            </h1>
          </div>
        </div>

        <ProductForm onSuccess={handleSuccess} />
      </div>
    </AdminLayout>
  );
};

export default ProductNew;
