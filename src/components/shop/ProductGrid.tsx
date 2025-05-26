
import React from "react";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Sparkles } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  discount_percentage?: number;
  in_stock: boolean;
  slug: string;
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative p-8 bg-muted/30 rounded-full">
            <Package className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
        
        <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 animate-scale-in">
          <Search className="h-4 w-4 mr-2" />
          No Products Found
        </Badge>
        
        <h3 className="text-2xl font-bold mb-4 text-foreground">
          No products match your criteria
        </h3>
        
        <p className="text-muted-foreground text-center max-w-md mb-8">
          We couldn't find any products that match your current filters or search. 
          Try adjusting your criteria or browse our full collection.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Try different keywords</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Clear your filters</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Browse all categories</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="animate-fade-in hover-lift-lg" 
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
