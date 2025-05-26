
import React, { useState, useMemo } from "react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Filter, Star, ShoppingCart, Heart, Grid, List } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useCart } from "@/components/cart/CartProvider";
import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";

const Shop = () => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { addToCart } = useCart();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange !== "all") {
        const price = Number(product.price);
        switch (priceRange) {
          case "0-25":
            matchesPrice = price <= 25;
            break;
          case "25-50":
            matchesPrice = price > 25 && price <= 50;
            break;
          case "50-100":
            matchesPrice = price > 50 && price <= 100;
            break;
          case "100+":
            matchesPrice = price > 100;
            break;
        }
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number(a.price) - Number(b.price);
        case "price-high":
          return Number(b.price) - Number(a.price);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  const getProductImage = (product: any) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return "/placeholder.svg";
  };

  if (productsLoading || categoriesLoading) {
    return (
      <>
        <SEOHead 
          title="Shop - Zyra"
          description="Browse our collection of premium custom products. Find personalized items, gifts, and more with fast delivery."
          url="https://zyra.lovable.app/shop"
        />
        <Navbar />
        <Container className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Shop - Zyra"
        description="Browse our collection of premium custom products. Find personalized items, gifts, and more with fast delivery."
        url="https://zyra.lovable.app/shop"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
              <ShoppingCart className="h-5 w-5 mr-3" />
              Premium Collection
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
              Shop Our Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
              Discover our curated collection of premium products. From custom designs to ready-made favorites, 
              find exactly what you're looking for.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        {/* Filters Section */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8 animate-scale-in">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 bg-background/50 border-border/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full lg:w-40 bg-background/50 border-border/50">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-25">$0 - $25</SelectItem>
                <SelectItem value="25-50">$25 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100+">$100+</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-40 bg-background/50 border-border/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="hover:scale-105 transition-transform"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="hover:scale-105 transition-transform"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="p-8 bg-muted/30 rounded-full w-fit mx-auto mb-6">
              <Search className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setPriceRange("all");
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredAndSortedProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className={`group overflow-hidden border-border/50 hover:shadow-2xl hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 animate-scale-in ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : "h-64"}`}>
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300">
                    <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.is_new && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white animate-pulse">New</Badge>
                    )}
                    {product.featured && (
                      <Badge className="bg-purple-500 hover:bg-purple-600 text-white">Featured</Badge>
                    )}
                    {product.discount_percentage && product.discount_percentage > 0 && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white">
                        -{product.discount_percentage}%
                      </Badge>
                    )}
                  </div>

                  {/* Stock Status */}
                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2">Out of Stock</Badge>
                    </div>
                  )}
                </div>

                <CardContent className={`p-6 flex-1 ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Link 
                        to={`/product/${product.id}`}
                        className="group-hover:text-primary transition-colors"
                      >
                        <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    {product.short_description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {product.short_description}
                      </p>
                    )}

                    {/* Rating */}
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.review_count || 0})
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        {product.discount_percentage && product.discount_percentage > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${(Number(product.price) / (1 - product.discount_percentage / 100)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`${viewMode === "list" ? "mt-4" : "mt-6"} space-y-2`}>
                    <Button 
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.in_stock}
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.in_stock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    
                    <Button variant="outline" asChild className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                      <Link to={`/product/${product.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
      
      <Footer />
    </>
  );
};

export default Shop;
