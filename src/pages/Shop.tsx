import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { mockProducts, mockCategories } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 50]);
  const [selectedFilters, setSelectedFilters] = useState({
    inStock: false,
    onSale: false,
    newArrivals: false,
  });
  
  const filteredProducts = mockProducts.filter((product) => {
    // Filter by category
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }
    
    // Filter by price
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Filter by stock
    if (selectedFilters.inStock && !product.inStock) {
      return false;
    }
    
    // Filter by sale
    if (selectedFilters.onSale && product.discountPercentage === 0) {
      return false;
    }
    
    // Filter by new arrivals
    if (selectedFilters.newArrivals && !product.isNew) {
      return false;
    }
    
    return true;
  });

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
                    {mockCategories.map((category) => (
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
                    defaultValue={[0, 50]}
                    max={50}
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
                  Showing {filteredProducts.length} results
                </p>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
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
