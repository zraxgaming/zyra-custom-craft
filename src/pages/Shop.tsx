
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductFilters from "@/components/shop/ProductFilters";
import SearchAndSort from "@/components/shop/SearchAndSort";
import { useProducts } from "@/hooks/use-products";
import { useProductFilters } from "@/hooks/useProductFilters";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const { products, isLoading, error } = useProducts();
  
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
    categories,
  } = useProductFilters(products || []);

  if (error) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          <div className="text-center animate-fade-in">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Error Loading Products</h1>
            <p className="text-muted-foreground">{error}</p>
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 text-foreground bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Shop
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover our collection of premium customizable products
            </p>
          </div>

          <div className="animate-slide-in-right">
            <SearchAndSort
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortOption}
              onSortChange={setSortOption}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            <aside className="w-full lg:w-64 flex-shrink-0 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="sticky top-4">
                <ProductFilters
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={toggleCategory}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  maxPrice={maxPrice}
                  showInStockOnly={showInStockOnly}
                  onShowInStockChange={setShowInStockOnly}
                  onResetFilters={resetFilters}
                />
              </div>
            </aside>

            <main className="flex-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredProducts.length} products
              </div>
              <ProductGrid 
                products={filteredProducts} 
                isLoading={isLoading}
              />
            </main>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Shop;
