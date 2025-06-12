
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, Sparkles, Star, ShoppingBag } from "lucide-react";
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
        title="Shop - Zyra Custom Craft"
        description="Discover our premium collection of customizable products. Shop the latest designs and create something unique."
        url="https://shopzyra.vercel.app/shop"
        keywords="shop, custom products, personalized gifts, crafts, design"
      />
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10">
        {/* Hero Section */}
        <section className="py-16">
          <Container>
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white text-lg px-6 py-2" variant="outline">
                <Sparkles className="h-5 w-5 mr-2" />
                Premium Collection
                <Star className="h-5 w-5 ml-2" />
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shop Collection
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover our curated selection of premium products. Customize, personalize, and make it yours.
              </p>
            </div>
          </Container>
        </section>

        {/* Search and Filters */}
        <Container className="pb-12">
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-56 h-12 text-lg border-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
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

            <div className="flex gap-3">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="lg"
                onClick={() => setViewMode("grid")}
                className="h-12 px-4"
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="lg"
                onClick={() => setViewMode("list")}
                className="h-12 px-4"
              >
                <List className="h-5 w-5" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden h-12 px-6"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex gap-8">
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80`}>
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

            <div className="flex-1">
              <ProductGrid products={sortedProducts} isLoading={isLoading} />
            </div>
          </div>
        </Container>
      </div>
      
      <Footer />
    </>
  );
};

export default Shop;
