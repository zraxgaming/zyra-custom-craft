
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: any[];
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  // Create an array of loading skeletons
  const loadingSkeletons = Array(6)
    .fill(0)
    .map((_, i) => (
      <div key={i} className="bg-white rounded-md overflow-hidden shadow-sm">
        <Skeleton className="h-64 w-full" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full mt-2" />
        </div>
      </div>
    ));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingSkeletons}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white/50 rounded-lg">
        <h3 className="text-xl font-medium text-gray-900">No products found</h3>
        <p className="text-gray-500 mt-2">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
