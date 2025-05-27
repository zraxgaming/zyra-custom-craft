
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Package, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category?: string;
}

interface EnhancedProductSearchProps {
  onProductSelect: (product: Product) => void;
  selectedProduct?: Product | null;
  label?: string;
  placeholder?: string;
}

const EnhancedProductSearch: React.FC<EnhancedProductSearchProps> = ({ 
  onProductSelect, 
  selectedProduct,
  label = "Search Product",
  placeholder = "Type product name or SKU..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchProducts();
    } else {
      setProducts([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const searchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, price, category')
        .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
        .eq('status', 'published')
        .limit(10);

      if (error) throw error;
      setProducts(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setSearchTerm('');
    setShowResults(false);
  };

  const clearSelection = () => {
    onProductSelect(null as any);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <Label htmlFor="product-search">{label}</Label>
      
      {selectedProduct && (
        <div className="mt-2 mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">
                {selectedProduct.name}
              </span>
              {selectedProduct.sku && (
                <Badge variant="outline" className="text-green-600">
                  {selectedProduct.sku}
                </Badge>
              )}
              <Badge variant="outline" className="text-green-600">
                ${selectedProduct.price}
              </Badge>
            </div>
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-green-600" />
            </button>
          </div>
        </div>
      )}

      {!selectedProduct && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="product-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
      )}

      {showResults && products.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto animate-fade-in">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductSelect(product)}
              className="w-full text-left p-3 hover:bg-muted transition-colors flex items-center justify-between group"
            >
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {product.sku && (
                    <span>SKU: {product.sku}</span>
                  )}
                  {product.category && (
                    <span>• {product.category}</span>
                  )}
                </div>
              </div>
              <Badge variant="outline">${product.price}</Badge>
            </button>
          ))}
        </div>
      )}

      {showResults && products.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-3 animate-fade-in">
          <p className="text-muted-foreground text-center">No products found</p>
        </div>
      )}

      {isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-3 animate-fade-in">
          <p className="text-muted-foreground text-center">Searching...</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedProductSearch;
