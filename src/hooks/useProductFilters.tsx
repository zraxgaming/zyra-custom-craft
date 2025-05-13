
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  in_stock: boolean;
  // Add other product fields as needed
}

export const useProductFilters = (products: Product[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
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
      maxPrice: Math.ceil(maxProductPrice / 5) * 5, // Round up to nearest 5
    };
  }, [products]);

  // Initialize price range based on products
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

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

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    if (minPriceParam && maxPriceParam) {
      setPriceRange([Number(minPriceParam), Number(maxPriceParam)]);
    } else {
      setPriceRange([0, maxPrice]);
    }

    const stockParam = searchParams.get("inStock");
    if (stockParam) {
      setShowInStockOnly(stockParam === "true");
    }
  }, [searchParams, maxPrice]);

  // Update URL when filters change
  const updateSearchParams = () => {
    const newSearchParams = new URLSearchParams();

    if (selectedCategories.length > 0) {
      newSearchParams.set("category", selectedCategories.join(","));
    }

    if (searchTerm) {
      newSearchParams.set("search", searchTerm);
    }

    if (sortOption !== "default") {
      newSearchParams.set("sort", sortOption);
    }

    if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
      newSearchParams.set("minPrice", String(priceRange[0]));
      newSearchParams.set("maxPrice", String(priceRange[1]));
    }

    if (showInStockOnly) {
      newSearchParams.set("inStock", "true");
    }

    setSearchParams(newSearchParams);
  };

  // Update search params whenever filters change
  useEffect(() => {
    updateSearchParams();
  }, [selectedCategories, searchTerm, sortOption, priceRange, showInStockOnly]);

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
    setSortOption("default");
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
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          default:
            return 0;
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
