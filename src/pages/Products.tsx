
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, ShoppingCart, Heart, Filter, Grid, List, Sparkles } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  review_count: number;
  description: string;
  is_new?: boolean;
  discount_percentage: number;
  in_stock: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  if (loading) {
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
        title="All Products - Zyra"
        description="Browse our complete collection of premium customizable products. Find the perfect item for your needs."
        url="https://zyra.lovable.app/products"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <Container className="relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                <Sparkles className="h-5 w-5 mr-3" />
                Complete Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
                All Products
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
                Explore our complete range of customizable products. From apparel to accessories, find everything you need.
              </p>
            </div>
          </Container>
        </section>

        {/* Filters */}
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
                  <SelectItem key={category} value={category}>{category}</SelectItem>
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
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 animate-fade-in bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden hover-lift-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Button size="icon" variant="outline" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background hover:scale-110 transition-transform duration-200">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge className="bg-primary/90 text-primary-foreground">
                      {product.category}
                    </Badge>
                    {product.is_new && (
                      <Badge className="bg-green-500 text-white">
                        New
                      </Badge>
                    )}
                    {product.discount_percentage > 0 && (
                      <Badge className="bg-red-500 text-white">
                        {product.discount_percentage}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-muted-foreground"
                        }`} 
                      />
                    ))}
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.review_count})</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ${product.discount_percentage > 0 
                          ? (product.price * (1 - product.discount_percentage / 100)).toFixed(2)
                          : product.price.toFixed(2)
                        }
                      </span>
                      {product.discount_percentage > 0 && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.in_stock}
                      className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.in_stock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="p-8 bg-muted/30 rounded-full w-fit mx-auto mb-6">
                <Search className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Products;
