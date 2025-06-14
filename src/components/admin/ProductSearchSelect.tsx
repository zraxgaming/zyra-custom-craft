
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Search, Package, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  images?: string[];
  stock_quantity: number;
}

interface ProductSearchSelectProps {
  onSelect: (product: Product | null) => void;
  selectedProduct?: Product | null;
  placeholder?: string;
}

const ProductSearchSelect: React.FC<ProductSearchSelectProps> = ({
  onSelect,
  selectedProduct,
  placeholder = "Search for a product..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, sku, price, images, stock_quantity')
          .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
          .eq('status', 'published')
          .limit(10);

        if (error) throw error;

        const transformedProducts: Product[] = (data || []).map(product => ({
          ...product,
          images: Array.isArray(product.images) 
            ? product.images.filter(img => typeof img === 'string') as string[]
            : []
        }));

        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error searching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelect = (product: Product) => {
    onSelect(product);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleClear = () => {
    onSelect(null);
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="relative space-y-4 animate-fade-in">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-pulse" />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {showDropdown && searchTerm.length >= 2 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto animate-scale-in border-primary/20 shadow-lg">
            <CardContent className="p-2">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="space-y-1">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelect(product)}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-300 hover:scale-105 animate-slide-in-right"
                      style={{animationDelay: `${index * 50}ms`}}
                    >
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded animate-scale-in"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm animate-text-shimmer">{product.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {product.sku && <span>SKU: {product.sku}</span>}
                          <span>${product.price}</span>
                          <Badge variant="outline" className="text-xs animate-pulse">
                            Stock: {product.stock_quantity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground animate-fade-in">
                  <Package className="h-8 w-8 mx-auto mb-2 animate-float" />
                  <p className="text-sm">No products found</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {selectedProduct && (
        <Card className="animate-scale-in border-primary/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedProduct.images && selectedProduct.images[0] && (
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-12 h-12 object-cover rounded animate-scale-in"
                  />
                )}
                <div>
                  <p className="font-medium animate-text-shimmer">{selectedProduct.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {selectedProduct.sku && <span>SKU: {selectedProduct.sku}</span>}
                    <span>${selectedProduct.price}</span>
                    <Badge variant="outline" className="text-xs animate-pulse">
                      Stock: {selectedProduct.stock_quantity}
                    </Badge>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="p-1 hover:bg-muted rounded-full transition-all duration-300 hover:scale-110"
              >
                <X className="h-4 w-4 text-muted-foreground animate-pulse" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductSearchSelect;
