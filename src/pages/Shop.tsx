
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
import { Sparkles, Package, AlertCircle } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const { data: products = [], isLoading, error } = useProducts();
  
  // Ensure products is an array and transform safely
  const safeProducts = Array.isArray(products) ? products : [];
  
  // Transform products to match the filter hook's Product interface
  const transformedProducts = safeProducts.map(product => ({
    id: product.id || '',
    name: product.name || '',
    price: product.price || 0,
    category: product.category || "Uncategorized",
    in_stock: product.in_stock || false,
    rating: product.rating || 0,
    created_at: product.created_at || new Date().toISOString(),
    featured: product.featured || false
  }));

  const filterResults = useProductFilters(transformedProducts);
  
  // Provide fallback values if hook returns undefined
  const {
    filteredProducts = [],
    searchTerm = '',
    setSearchTerm = () => {},
    sortOption = 'featured',
    setSortOption = () => {},
    selectedCategories = [],
    toggleCategory = () => {},
    priceRange = [0, 1000],
    setPriceRange = () => {},
    maxPrice = 1000,
    showInStockOnly = false,
    setShowInStockOnly = () => {},
    resetFilters = () => {},
    categories = [],
  } = filterResults || {};

  // Transform filtered products back to full Product type for display
  const fullFilteredProducts = filteredProducts.map(filteredProduct => {
    const originalProduct = safeProducts.find(p => p.id === filteredProduct.id);
    return originalProduct ? {
      ...originalProduct,
      description: originalProduct.description || "",
      images: originalProduct.images || [],
      slug: originalProduct.slug || originalProduct.id,
      rating: originalProduct.rating || 0,
      review_count: originalProduct.review_count || 0,
      is_new: originalProduct.is_new || false,
      discount_percentage: originalProduct.discount_percentage || 0,
      status: originalProduct.status || "published" as const,
      featured: originalProduct.featured || false,
      is_customizable: originalProduct.is_customizable || false,
      is_digital: originalProduct.is_digital || false
    } : {
      ...filteredProduct,
      description: "",
      images: [],
      slug: filteredProduct.id,
      rating: filteredProduct.rating || 0,
      review_count: 0,
      is_new: false,
      discount_percentage: 0,
      status: "published" as const,
      featured: filteredProduct.featured || false,
      is_customizable: false,
      is_digital: false
    };
  });

  if (error) {
    return (
      <>
        <SEOHead 
          title="Shop - Error Loading Products"
          description="We're experiencing issues loading our products. Please try again later."
          noIndex={true}
        />
        <Navbar />
        <Container className="py-12">
          <div className="text-center animate-fade-in">
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-500/10 to-orange-500/10 p-6 rounded-3xl border border-red-500/20 backdrop-blur-sm">
                <AlertCircle className="mx-auto h-16 w-16 text-red-500 animate-bounce" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-scale-in">
              Oops! Something went wrong
            </h1>
            <p className="text-muted-foreground text-lg mb-8 animate-slide-in-right">
              {error?.message || 'We encountered an issue loading our products. Please try again later.'}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-all duration-300 animate-bounce-in"
            >
              Try Again
            </Button>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  // Transform categories to match expected interface
  const categoryOptions = categories.map(category => ({
    name: category,
    id: category
  }));

  // Ensure priceRange is a valid tuple
  const priceRangeTuple: [number, number] = [
    priceRange?.[0] || 0, 
    priceRange?.[1] || maxPrice || 1000
  ];

  return (
    <>
      <SEOHead 
        title="Shop Premium Products - Zyra"
        description="Discover our collection of premium customizable products. From personalized items to luxury goods, find exactly what you're looking for."
        keywords="shop, premium products, customizable items, personalized goods, luxury shopping, e-commerce"
        url="https://zyra.lovable.app/shop"
      />
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Premium Hexagonal Pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagonal-pattern" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
                <polygon points="60,4 90,26 90,70 60,92 30,70 30,26" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                <polygon points="60,20 80,32 80,56 60,68 40,56 40,32" fill="currentColor" opacity="0.1"/>
                <circle cx="60" cy="48" r="8" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
                <path d="M45,48 L75,48 M60,33 L60,63" stroke="currentColor" strokeWidth="0.2" opacity="0.2"/>
              </pattern>
              <linearGradient id="gradient-overlay" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1"/>
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.05"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagonal-pattern)"/>
            <rect width="100%" height="100%" fill="url(#gradient-overlay)"/>
          </svg>
        </div>

        <Container className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-3 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary/20 to-purple-500/20 p-4 rounded-3xl border border-primary/30 backdrop-blur-sm hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                    Premium Shop
                  </h1>
                  <p className="text-muted-foreground text-xl mt-3 animate-slide-in-right flex items-center gap-3">
                    <span className="inline-block w-3 h-3 bg-gradient-to-r from-primary to-purple-600 rounded-full animate-pulse"></span>
                    <span>Discover our collection of premium customizable products</span>
                    <span className="inline-block w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-slide-in-right mb-8" style={{ animationDelay: '0.1s' }}>
              <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-4 hover:shadow-xl transition-all duration-300">
                <SearchAndSort
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortOption}
                  onSortChange={setSortOption}
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="w-full lg:w-72 flex-shrink-0 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                <div className="sticky top-4">
                  <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
                    <ProductFilters
                      categories={categoryOptions}
                      selectedCategories={selectedCategories}
                      onCategoryChange={toggleCategory}
                      priceRange={priceRangeTuple}
                      onPriceRangeChange={setPriceRange}
                      maxPrice={maxPrice}
                      showInStockOnly={showInStockOnly}
                      onShowInStockChange={setShowInStockOnly}
                      onResetFilters={resetFilters}
                    />
                  </div>
                </div>
              </aside>

              <main className="flex-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="mb-8 flex items-center justify-between bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl hover:scale-110 transition-transform duration-300">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        Showing {fullFilteredProducts.length} products
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Premium quality guaranteed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full w-20 animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-pink-600 via-purple-600 to-primary rounded-full w-12 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="h-3 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 rounded-full w-8 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
                
                <ProductGrid 
                  products={fullFilteredProducts} 
                  isLoading={isLoading}
                />
              </main>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
