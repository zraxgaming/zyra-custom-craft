
import React from "react";
import { Product } from "@/hooks/use-products";
import ProductCard from "@/components/products/ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-lg mb-4 loading-shimmer"></div>
            <div className="h-4 bg-muted rounded mb-2 loading-shimmer"></div>
            <div className="h-4 bg-muted rounded w-3/4 loading-shimmer"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-card/50 rounded-lg animate-bounce-in">
        <div className="text-6xl mb-4 animate-scale-in">🛍️</div>
        <h3 className="text-xl font-medium text-foreground animate-fade-in">No products found</h3>
        <p className="text-muted-foreground mt-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
