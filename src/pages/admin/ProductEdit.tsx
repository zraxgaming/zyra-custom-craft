
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Check if it's a new product or editing an existing one
  const isNewProduct = !id;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {isNewProduct ? "Create New Product" : "Edit Product"}
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <ProductForm 
            productId={id} 
            onSuccess={() => {
              navigate("/admin/products");
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductEdit;
