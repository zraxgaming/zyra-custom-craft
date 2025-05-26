
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, ShoppingCart, Heart, Star } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Mock product data
  const products = [
    {
      id: "1",
      name: "Custom T-Shirt",
      price: 29.99,
      image: "/placeholder.svg",
      category: "Clothing",
      rating: 4.8,
      reviews: 124,
      description: "Premium quality custom t-shirt with your design"
    },
    {
      id: "2", 
      name: "Personalized Mug",
      price: 19.99,
      image: "/placeholder.svg",
      category: "Drinkware",
      rating: 4.9,
      reviews: 89,
      description: "High-quality ceramic mug with custom printing"
    },
    {
      id: "3",
      name: "Custom Phone Case",
      price: 24.99,
      image: "/placeholder.svg",
      category: "Accessories",
      rating: 4.7,
      reviews: 156,
      description: "Durable phone case with your personal design"
    },
    {
      id: "4",
      name: "Custom Notebook",
      price: 34.99,
      image: "/placeholder.svg",
      category: "Stationery",
      rating: 4.6,
      reviews: 67,
      description: "Premium hardcover notebook with custom cover"
    },
    {
      id: "5",
      name: "Personalized Water Bottle",
      price: 39.99,
      image: "/placeholder.svg",
      category: "Drinkware",
      rating: 4.8,
      reviews: 98,
      description: "Insulated water bottle with custom engraving"
    },
    {
      id: "6",
      name: "Custom Tote Bag",
      price: 22.99,
      image: "/placeholder.svg",
      category: "Bags",
      rating: 4.5,
      reviews: 143,
      description: "Eco-friendly tote bag with your design"
    }
  ];

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart.",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEOHead 
        title="Shop Custom Products - Zyra"
        description="Browse our collection of premium custom products. Create personalized items with high-quality materials and fast delivery."
        url="https://zyra.lovable.app/shop"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
          </div>
          
          <Container className="relative z-10">
            <div className="text-center mb-12 animate-fade-in">
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
        <Container className="py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
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
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 animate-fade-in bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Button size="icon" variant="outline" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
                    {product.category}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
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

export default Shop;
