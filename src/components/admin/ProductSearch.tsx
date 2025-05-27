
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  selectedProduct?: Product | null;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onProductSelect, selectedProduct }) => {
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
        .select('id, name, sku, price')
        .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
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
    setSearchTerm(product.name);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <Label htmlFor="product-search">Search Product</Label>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="product-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type product name or SKU..."
          className="pl-10"
        />
      </div>

      {selectedProduct && (
        <div className="mt-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800 dark:text-green-200">
              Selected: {selectedProduct.name}
            </span>
            <Badge variant="outline" className="text-green-600">
              ${selectedProduct.price}
            </Badge>
          </div>
        </div>
      )}

      {showResults && products.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductSelect(product)}
              className="w-full text-left p-3 hover:bg-muted transition-colors flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                {product.sku && (
                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                )}
              </div>
              <Badge variant="outline">${product.price}</Badge>
            </button>
          ))}
        </div>
      )}

      {showResults && products.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-3">
          <p className="text-muted-foreground text-center">No products found</p>
        </div>
      )}

      {isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-3">
          <p className="text-muted-foreground text-center">Searching...</p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
