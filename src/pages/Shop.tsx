
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
    rating: product.rating || 0, // Ensure rating is always a number
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
      rating: originalProduct.rating || 0, // Ensure rating is always provided
      review_count: originalProduct.review_count || 0,
      is_new: originalProduct.is_new || false,
      discount_percentage: originalProduct.discount_percentage || 0,
      status: originalProduct.status || "published"
    } : {
      ...filteredProduct,
      description: "",
      images: [],
      slug: filteredProduct.id,
      rating: filteredProduct.rating || 0, // Ensure rating is always provided
      review_count: 0,
      is_new: false,
      discount_percentage: 0,
      status: "published"
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
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geometric-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <polygon points="60,0 120,60 60,120 0,60" fill="currentColor" opacity="0.4"/>
                <circle cx="60" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
                <path d="M30,30 L90,30 L90,90 L30,90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geometric-pattern)"/>
          </svg>
        </div>

        <Container className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                  Shop
                </h1>
              </div>
              <p className="text-muted-foreground text-lg animate-slide-in-right flex items-center gap-2">
                <span className="text-primary">✨</span>
                <span>Discover our collection of premium customizable products</span>
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
      </div>
      <Footer />
    </>
  );
};

export default Shop;
