
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PageLoader } from "@/components/ui/page-loader";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import Newsletter from "@/components/home/Newsletter";

const Index = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  
  const isLoading = productsLoading || categoriesLoading;
  const featuredProducts = products.filter(p => p.is_new || p.discount_percentage > 0 || p.featured).slice(0, 8);

  if (isLoading) {
    return <PageLoader message="Loading homepage..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        
        {featuredProducts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <FeaturedProducts products={featuredProducts} />
          </section>
        )}
        
        {categories.length > 0 && (
          <section className="py-16">
            <Categories />
          </section>
        )}
        
        <section className="py-16 bg-muted/30">
          <Newsletter />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
