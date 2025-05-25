
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "../products/ProductCard";
import { Product } from "@/hooks/use-products";

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Discover our most popular customizable products that customers love
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0 btn-animate">
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
