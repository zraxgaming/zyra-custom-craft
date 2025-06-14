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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <SEOHead 
          title="Shop - Zyra Custom Craft"
          description="Browse all premium personalized products available for customization and purchase."
        />
        <h1 className="text-4xl font-bold mb-8 text-center animate-fade-in-professional">Shop</h1>
        {/* Subtle fade in for products */}
        <div className="grid gap-6 md:grid-cols-3 animate-fade-in-professional">
          <ProductGrid products={sortedProducts} isLoading={isLoading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
