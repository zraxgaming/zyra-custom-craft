
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  in_stock: boolean;
  rating?: number;
  created_at?: string;
  featured?: boolean;
}

export const useProductFilters = (products: Product[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Get unique categories and max price from products
  const { categories, maxPrice } = useMemo(() => {
    const categorySet = new Set<string>();
    let maxProductPrice = 0;

    products.forEach((product) => {
      if (product.category) {
        categorySet.add(product.category);
      }
      if (product.price > maxProductPrice) {
        maxProductPrice = product.price;
      }
    });

    return {
      categories: Array.from(categorySet).map(name => ({ name, id: name })),
      maxPrice: Math.max(Math.ceil(maxProductPrice / 5) * 5, 100), // Ensure minimum of 100
    };
  }, [products]);

  // Initialize price range based on products
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  // Update price range when maxPrice changes
  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  // Load filters from URL on initial load
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(","));
    }

    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    const sortParam = searchParams.get("sort");
    if (sortParam) {
      setSortOption(sortParam);
    }

    const stockParam = searchParams.get("inStock");
    if (stockParam) {
      setShowInStockOnly(stockParam === "true");
    }
  }, [searchParams]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
    setSortOption("featured");
    setPriceRange([0, maxPrice]);
    setShowInStockOnly(false);
    setSearchParams({});
  };

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Filter by category
        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(product.category)
        ) {
          return false;
        }

        // Filter by price range
        if (
          product.price < priceRange[0] ||
          product.price > priceRange[1]
        ) {
          return false;
        }

        // Filter by stock
        if (showInStockOnly && !product.in_stock) {
          return false;
        }

        // Filter by search term
        if (
          searchTerm &&
          !product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort products
        switch (sortOption) {
          case "name":
            return a.name.localeCompare(b.name);
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "newest":
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          case "featured":
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [
    products,
    selectedCategories,
    priceRange,
    showInStockOnly,
    searchTerm,
    sortOption,
  ]);

  return {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    selectedCategories,
    toggleCategory,
    priceRange,
    setPriceRange,
    maxPrice,
    showInStockOnly,
    setShowInStockOnly,
    resetFilters,
    categories,
  };
};
