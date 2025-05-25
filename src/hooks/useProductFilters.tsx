
import { useState, useMemo } from 'react';

interface FilteredProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  in_stock: boolean;
  rating: number;
  created_at: string;
  featured: boolean;
}

export interface ProductFilters {
  searchTerm: string;
  sortOption: string;
  selectedCategories: string[];
  priceRange: number[];
  showInStockOnly: boolean;
}

export const useProductFilters = (products: FilteredProduct[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const maxPrice = useMemo(() => {
    return Math.max(...products.map(p => p.price), 1000);
  }, [products]);

  const categories = useMemo(() => {
    const categorySet = new Set(products.map(p => p.category));
    return Array.from(categorySet).filter(Boolean);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Stock filter
      if (showInStockOnly && !product.in_stock) {
        return false;
      }

      return true;
    });

    // Sort
    switch (sortOption) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
        filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategories, priceRange, showInStockOnly, sortOption]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSortOption('newest');
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setShowInStockOnly(false);
  };

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
