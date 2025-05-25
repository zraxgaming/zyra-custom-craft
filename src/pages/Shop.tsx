
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
import SEOHead from "@/components/seo/SEOHead";

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
    rating: product.rating || 0,
    created_at: product.created_at || new Date().toISOString(),
    featured: product.featured || false
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
    return originalProduct ? {
      ...originalProduct,
      // Ensure all required properties exist with proper defaults
      description: originalProduct.description || "",
      images: originalProduct.images || [],
      slug: originalProduct.slug || originalProduct.id,
      rating: originalProduct.rating || 0,
      review_count: originalProduct.review_count || 0,
      is_new: originalProduct.is_new || false,
      discount_percentage: originalProduct.discount_percentage || 0,
      status: originalProduct.status || "published",
      featured: originalProduct.featured || false
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
      featured: filteredProduct.featured || false
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
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4 animate-bounce" />
            <h1 className="text-2xl font-bold mb-4 text-foreground">Error Loading Products</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  const shopStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shop - Premium Products",
    "description": "Browse our collection of premium customizable products",
    "url": "https://zyra.lovable.app/shop",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": fullFilteredProducts.length,
      "itemListElement": fullFilteredProducts.slice(0, 10).map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": product.name,
        "description": product.description,
        "image": product.images?.[0],
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "USD",
          "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
      }))
    }
  };

  return (
    <>
      <SEOHead 
        title="Shop Premium Products - Zyra"
        description="Discover our collection of premium customizable products. From personalized items to luxury goods, find exactly what you're looking for."
        keywords="shop, premium products, customizable items, personalized goods, luxury shopping, e-commerce"
        structuredData={shopStructuredData}
        url="https://zyra.lovable.app/shop"
      />
      <Navbar />
      <div className="relative min-h-screen bg-background">
        {/* Premium Hexagonal Pattern Background */}
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
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-3 rounded-2xl border border-primary/20 backdrop-blur-sm">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                    Premium Shop
                  </h1>
                  <p className="text-muted-foreground text-lg mt-2 animate-slide-in-right flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full animate-pulse"></span>
                    <span>Discover our collection of premium customizable products</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-slide-in-right mb-8" style={{ animationDelay: '0.1s' }}>
              <SearchAndSort
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortBy={sortOption}
                onSortChange={setSortOption}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="w-full lg:w-72 flex-shrink-0 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                <div className="sticky top-4">
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
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
                </div>
              </aside>

              <main className="flex-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="mb-8 flex items-center justify-between bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Showing {fullFilteredProducts.length} products
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Premium quality guaranteed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full w-16 animate-pulse"></div>
                    <div className="h-2 bg-gradient-to-r from-pink-600 via-purple-600 to-primary rounded-full w-8 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
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
