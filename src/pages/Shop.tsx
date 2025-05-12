
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [selectedFilters, setSelectedFilters] = useState({
    inStock: false,
    onSale: false,
    newArrivals: false,
  });
  
  const { toast } = useToast();
  
  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error loading categories",
          description: error.message,
          variant: "destructive",
        });
      }
    }
    
    fetchCategories();
  }, [toast]);
  
  // Fetch products with filters
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        
        let query = supabase.from("products").select("*");
        
        // Apply category filter
        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
        }
        
        // Apply price filter
        query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);
        
        // Apply other filters
        if (selectedFilters.inStock) {
          query = query.eq("in_stock", true);
        }
        
        if (selectedFilters.onSale) {
          query = query.gt("discount_percentage", 0);
        }
        
        if (selectedFilters.newArrivals) {
          query = query.eq("is_new", true);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setProducts(data || []);
        
        // Get max price for the slider
        const { data: maxPriceData, error: maxPriceError } = await supabase
          .from("products")
          .select("price")
          .order("price", { ascending: false })
          .limit(1);
          
        if (!maxPriceError && maxPriceData && maxPriceData.length > 0) {
          const calculatedMaxPrice = Math.ceil(maxPriceData[0].price / 10) * 10; // Round to next 10
          setMaxPrice(calculatedMaxPrice);
          setPriceRange([0, calculatedMaxPrice]);
        }
      } catch (error: any) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, [selectedCategory, selectedFilters, toast]);
  
  // Handle category change
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-zyra-purple text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">Shop All Products</h1>
            <p className="mt-2">Find the perfect blank canvas for your creativity</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                
                {/* Category filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Category</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Button
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("all")}
                        className={selectedCategory === "all" ? "bg-zyra-purple hover:bg-zyra-dark-purple" : ""}
                      >
                        All Products
                      </Button>
                    </div>
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <Button
                          variant={selectedCategory === category.slug ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.slug)}
                          className={selectedCategory === category.slug ? "bg-zyra-purple hover:bg-zyra-dark-purple" : ""}
                        >
                          {category.name}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price range filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Price Range</h3>
                  <Slider
                    defaultValue={[0, maxPrice]}
                    max={maxPrice}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">${priceRange[0]}</span>
                    <span className="text-sm font-medium">${priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Other filters */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Other Filters</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock"
                        checked={selectedFilters.inStock}
                        onCheckedChange={(checked) =>
                          setSelectedFilters({ ...selectedFilters, inStock: !!checked })
                        }
                      />
                      <label
                        htmlFor="in-stock"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        In Stock
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="on-sale"
                        checked={selectedFilters.onSale}
                        onCheckedChange={(checked) =>
                          setSelectedFilters({ ...selectedFilters, onSale: !!checked })
                        }
                      />
                      <label
                        htmlFor="on-sale"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        On Sale
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new-arrivals"
                        checked={selectedFilters.newArrivals}
                        onCheckedChange={(checked) =>
                          setSelectedFilters({ ...selectedFilters, newArrivals: !!checked })
                        }
                      />
                      <label
                        htmlFor="new-arrivals"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        New Arrivals
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products grid */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {products.length} results
                </p>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
