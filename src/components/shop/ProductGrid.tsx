
import React from "react";
import { Product } from "@/hooks/use-products";
import ProductCard from "@/components/products/ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (products.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-card/50 rounded-lg animate-fade-in">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-xl font-medium text-foreground">No products found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="animate-fade-in card-hover" 
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
