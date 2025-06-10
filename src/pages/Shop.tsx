
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, Sparkles, Star, ShoppingBag, Zap } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductFilters from "@/components/shop/ProductFilters";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";

const Shop = () => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [inStock, setInStock] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [customizable, setCustomizable] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || 
                           selectedCategories.some(catId => {
                             const category = categories.find(c => c.id === catId);
                             return category && product.category === category.name;
                           });
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesStock = !inStock || product.in_stock;
    const matchesFeatured = !featured || product.featured;
    const matchesCustomizable = !customizable || product.is_customizable;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesFeatured && matchesCustomizable;
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
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const isLoading = productsLoading || categoriesLoading;

  return (
    <>
      <SEOHead 
        title="Shop - Zyra"
        description="Discover our premium collection of customizable products. Shop the latest designs and create something unique."
        url="https://shopzyra.vercel.app/shop"
      />
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Multiple Animated Background Layers */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float-reverse"></div>
          <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl animate-pulse-gentle"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-green-500 to-teal-500 rounded-full blur-xl animate-float"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-primary rounded-full animate-float`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Geometric Shapes */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05]">
          <div className="absolute top-40 left-[10%] w-16 h-16 border-2 border-primary/20 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-40 right-[15%] w-12 h-12 border-2 border-purple-500/20 rounded-full animate-pulse-glow"></div>
          <div className="absolute top-[60%] left-[80%] w-20 h-20 border-2 border-pink-500/20 rotate-12 animate-float"></div>
          <div className="absolute top-[20%] right-[70%] w-8 h-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-[60%] left-[60%] w-14 h-14 border-2 border-orange-500/20 transform rotate-45 animate-wiggle"></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <Container className="relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <div className="flex justify-center mb-8">
                <Badge className="mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:scale-110 transition-transform duration-300 text-lg px-8 py-4 animate-bounce-in" variant="outline">
                  <Sparkles className="h-6 w-6 mr-3 animate-spin" />
                  Premium Collection
                  <Star className="h-6 w-6 ml-3 animate-pulse" />
                </Badge>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-text-shimmer">
                Shop Collection
              </h1>
              
              <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto animate-slide-in-up leading-relaxed" style={{ animationDelay: '0.3s' }}>
                Discover our curated selection of premium products. Customize, personalize, and make it yours.
              </p>

              {/* Animated Icons */}
              <div className="flex justify-center gap-8 mt-12 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex flex-col items-center animate-float">
                  <ShoppingBag className="h-12 w-12 text-primary mb-2 animate-bounce" />
                  <span className="text-sm font-medium">Quality</span>
                </div>
                <div className="flex flex-col items-center animate-float" style={{ animationDelay: '1s' }}>
                  <Zap className="h-12 w-12 text-purple-600 mb-2 animate-pulse" />
                  <span className="text-sm font-medium">Fast</span>
                </div>
                <div className="flex flex-col items-center animate-float" style={{ animationDelay: '2s' }}>
                  <Star className="h-12 w-12 text-orange-600 mb-2 animate-spin-slow" />
                  <span className="text-sm font-medium">Custom</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Search and Filters */}
        <Container className="py-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 mb-12 animate-fade-in">
            <div className="flex-1 animate-slide-in-left">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-hover:text-primary transition-colors duration-300 animate-pulse" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 hover:scale-105 focus:scale-105 transition-transform duration-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
                />
              </div>
            </div>

            <div className="animate-slide-in-right">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-56 h-14 text-lg border-2 hover:scale-105 transition-transform duration-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 animate-bounce-in">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="lg"
                onClick={() => setViewMode("grid")}
                className="h-14 px-6 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Grid className="h-5 w-5 animate-pulse" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="lg"
                onClick={() => setViewMode("list")}
                className="h-14 px-6 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <List className="h-5 w-5 animate-pulse" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden h-14 px-6 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl animate-wiggle"
            >
              <Filter className="h-5 w-5 mr-2 animate-spin-slow" />
              Filters
            </Button>
          </div>

          <div className="flex gap-12">
            <div className={`${showFilters ? 'block animate-slide-in-left' : 'hidden'} lg:block w-full lg:w-80`}>
              <div className="animate-scale-in">
                <ProductFilters 
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  inStock={inStock}
                  onInStockChange={setInStock}
                  featured={featured}
                  onFeaturedChange={setFeatured}
                  customizable={customizable}
                  onCustomizableChange={setCustomizable}
                />
              </div>
            </div>

            <div className="flex-1 animate-fade-in">
              <div className="animate-slide-in-up">
                <ProductGrid products={sortedProducts} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </Container>
      </div>
      
      <Footer />
    </>
  );
};

export default Shop;
