
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useProductFilters } from "@/hooks/useProductFilters";
import ProductFilters from "@/components/shop/ProductFilters";
import ProductGrid from "@/components/shop/ProductGrid";
import SearchAndSort from "@/components/shop/SearchAndSort";

const Shop = () => {
  const { products, error: productsError, isLoading: productsLoading } = useProducts();
  const { categories } = useCategories();
  
  const {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    selectedCategories,
    toggleCategory,
    priceRange,
    setPriceRange,
    maxPrice,
    showInStockOnly,
    setShowInStockOnly,
    resetFilters,
  } = useProductFilters(products);

  if (productsError) {
    return (
      <>
        <Navbar />
        <Container className="py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Error Loading Products</h1>
            <p className="text-muted-foreground">{productsError}</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop All Products</h1>
          <p className="text-muted-foreground">
            Browse our collection of {products.length} products and find the perfect item for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:block">
            <ProductFilters 
              categories={categories.map(cat => ({ name: cat.name, id: cat.id }))}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
              showInStockOnly={showInStockOnly}
              setShowInStockOnly={setShowInStockOnly}
              resetFilters={resetFilters}
            />
          </div>

          <div className="lg:col-span-3">
            <SearchAndSort 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
            
            <ProductGrid products={filteredProducts} isLoading={productsLoading} />
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Shop;
