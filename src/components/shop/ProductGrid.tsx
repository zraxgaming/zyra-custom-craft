
import React from "react";
import { Product } from "@/hooks/use-products";
import ProductCard from "@/components/products/ProductCard";
import { Package, Search, Sparkles } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl mb-4 loading-shimmer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            <div className="space-y-3">
              <div className="h-5 bg-gradient-to-r from-muted to-muted/50 rounded-lg loading-shimmer" />
              <div className="h-4 bg-gradient-to-r from-muted to-muted/50 rounded w-3/4 loading-shimmer" />
              <div className="h-6 bg-gradient-to-r from-muted to-muted/50 rounded w-1/2 loading-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-card/50 to-muted/20 rounded-2xl animate-bounce-in border-2 border-dashed border-border/50 backdrop-blur-sm">
        <div className="text-center space-y-6 p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-2xl" />
            <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 rounded-full">
              <Package className="h-16 w-16 text-muted-foreground/70 mx-auto animate-bounce" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-foreground animate-fade-in flex items-center justify-center gap-2">
              <Search className="h-6 w-6" />
              No products found
            </h3>
            <p className="text-muted-foreground animate-fade-in max-w-md mx-auto" style={{ animationDelay: '0.1s' }}>
              We couldn't find any products matching your criteria. Try adjusting your search or filter settings.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/60 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Sparkles className="h-4 w-4" />
            <span>Discover amazing products in our collection</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="animate-fade-in hover:scale-[1.02] transition-all duration-500 transform-gpu" 
          style={{ 
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'backwards'
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
