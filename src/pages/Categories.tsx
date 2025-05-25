
import React from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCategories } from "@/hooks/use-categories";
import { Grid, Sparkles, Package, TrendingUp, ShoppingBag } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Categories = () => {
  const { data: categories = [], isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <>
        <SEOHead 
          title="Product Categories - Zyra"
          description="Browse our extensive range of product categories"
        />
        <Navbar />
        <Container className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/60 rounded-2xl mb-4 loading-shimmer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gradient-to-r from-muted/30 to-muted/60 rounded-lg loading-shimmer" />
                  <div className="h-4 bg-gradient-to-r from-muted/30 to-muted/60 rounded w-3/4 loading-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead 
          title="Categories - Error"
          description="Error loading categories"
          noIndex={true}
        />
        <Navbar />
        <Container className="py-12">
          <div className="text-center animate-fade-in">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4 animate-bounce" />
            <h1 className="text-2xl font-bold mb-4 text-foreground">Error Loading Categories</h1>
            <p className="text-muted-foreground">{error?.message || 'Unknown error occurred'}</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  const categoryStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Product Categories",
    "description": "Browse our extensive range of product categories",
    "url": "https://zyra.lovable.app/categories",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": categories.length,
      "itemListElement": categories.map((category, index) => ({
        "@type": "Thing",
        "position": index + 1,
        "name": category.name,
        "description": category.description,
        "url": `/shop?category=${category.slug}`
      }))
    }
  };

  return (
    <>
      <SEOHead 
        title="Product Categories - Zyra"
        description="Browse our extensive range of product categories. Find exactly what you're looking for with our organized category system."
        keywords="categories, products, shopping, organization, browse, custom products, phone cases, mugs, apparel"
        structuredData={categoryStructuredData}
        url="https://zyra.lovable.app/categories"
      />
      <Navbar />
      <div className="relative min-h-screen bg-background">
        {/* Premium background pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="category-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.1"/>
                <path d="M20,50 L80,50 M50,20 L50,80" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
              <linearGradient id="gradient-overlay" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1"/>
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.05"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#category-pattern)"/>
            <rect width="100%" height="100%" fill="url(#gradient-overlay)"/>
          </svg>
        </div>

        <Container className="py-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
                    <Grid className="h-8 w-8 text-blue-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Categories
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">Discover our premium product collection</p>
                </div>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                Explore our diverse range of customizable products, from tech accessories to home decor
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {categories.length} Categories
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium Quality
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  Customizable
                </Badge>
              </div>
            </div>

            {/* Categories Grid */}
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                    className="group block animate-scale-in hover-scale"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    <div className="relative bg-gradient-to-br from-card/80 to-card/40 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-border/50 hover:border-primary/30 backdrop-blur-sm">
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {/* Category Image */}
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl mb-4 overflow-hidden">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors duration-300">
                            <div className="text-4xl mb-2 animate-float">
                              {category.icon || '📦'}
                            </div>
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Icon overlay */}
                        {category.icon && (
                          <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                            <span className="text-lg">{category.icon}</span>
                          </div>
                        )}
                      </div>

                      {/* Category Info */}
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
                            {category.description}
                          </p>
                        )}
                        
                        {/* Action indicator */}
                        <div className="flex items-center justify-between mt-4">
                          <Badge variant="outline" className="text-xs group-hover:border-primary group-hover:text-primary transition-colors duration-300">
                            Browse {category.name}
                          </Badge>
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                            <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-white transition-colors duration-300" />
                          </div>
                        </div>
                      </div>

                      {/* Animated border */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-20 animate-pulse" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-bounce-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-muted/10 rounded-full blur-2xl" />
                  <div className="relative bg-gradient-to-br from-muted/10 to-muted/5 p-8 rounded-full mx-auto w-32 h-32 flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground/70 animate-bounce" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mt-6 mb-2">No Categories Found</h2>
                <p className="text-muted-foreground">Categories will appear here once they are added.</p>
              </div>
            )}
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Categories;
