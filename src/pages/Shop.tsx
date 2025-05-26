
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, Heart, Star, Sparkles } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Link } from "react-router-dom";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container className="py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Shop Custom Products - Zyra"
        description="Browse our collection of premium custom products. Create personalized items with high-quality materials and fast delivery."
        url="https://zyra.lovable.app/shop"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <Container className="relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                <Sparkles className="h-5 w-5 mr-3" />
                Premium Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                Shop Custom Products
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
                Discover our premium collection of customizable products. Create something unique that's perfectly you.
              </p>
            </div>
          </Container>
        </section>

        {/* Filters and Search */}
        <Container className="py-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 hover:scale-105 transition-transform duration-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 hover:scale-105 transition-transform duration-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="hover:scale-110 transition-transform duration-200"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="hover:scale-110 transition-transform duration-200"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 animate-fade-in ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {sortedProducts.map((product, index) => (
              <Card 
                key={product.id}
                className={`group bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48" : "aspect-square"}`}>
                  <Link to={`/product/${product.slug}`}>
                    {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                      <img
                        src={product.images[0] as string}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-primary/50" />
                      </div>
                    )}
                  </Link>
                  
                  {product.discount_percentage > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 animate-bounce">
                      -{product.discount_percentage}%
                    </Badge>
                  )}
                  
                  {product.is_new && (
                    <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 animate-pulse">
                      New
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className={`p-4 flex-1 ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}>
                  <div className="space-y-2">
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors duration-200 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    )}

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.review_count || 0})
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-foreground">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.discount_percentage > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${(product.price / (1 - product.discount_percentage / 100)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        images: product.images as string[],
                        slug: product.slug,
                        in_stock: product.in_stock,
                        stock_status: product.stock_status
                      }}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="p-8 bg-muted/30 rounded-full w-fit mx-auto mb-6">
                <Search className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setSortBy("featured");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
