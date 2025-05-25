
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
import { Sparkles, Package } from "lucide-react";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const { products, isLoading, error } = useProducts();
  
  // Transform products to match the filter hook's Product interface
  const transformedProducts = (products || []).map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category || "Uncategorized",
    in_stock: product.in_stock,
    rating: product.rating,
    created_at: product.created_at,
    featured: product.featured
  }));

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
  } = useProductFilters(transformedProducts);

  // Transform filtered products back to full Product type for display
  const fullFilteredProducts = filteredProducts.map(filteredProduct => {
    const originalProduct = products?.find(p => p.id === filteredProduct.id);
    return originalProduct || filteredProduct;
  });

  if (error) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          <div className="text-center animate-fade-in">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4 animate-bounce" />
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
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Shop
              </h1>
            </div>
            <p className="text-muted-foreground text-lg animate-slide-in-right">
              ✨ Discover our collection of premium customizable products
            </p>
          </div>

          <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
            <SearchAndSort
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortOption}
              onSortChange={setSortOption}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            <aside className="w-full lg:w-64 flex-shrink-0 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
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
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Showing {fullFilteredProducts.length} products</span>
                </div>
                <div className="h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full w-24 animate-pulse"></div>
              </div>
              <ProductGrid 
                products={fullFilteredProducts} 
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
