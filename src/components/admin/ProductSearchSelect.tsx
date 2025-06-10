
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Package, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductSearchSelectProps {
  onSelect: (product: any) => void;
  selectedProduct?: any;
  placeholder?: string;
}

const ProductSearchSelect: React.FC<ProductSearchSelectProps> = ({
  onSelect,
  selectedProduct,
  placeholder = "Search for a product..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchProducts();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  const searchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,barcode.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      setProducts(data || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (product: any) => {
    onSelect(product);
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearSelection = () => {
    onSelect(null);
  };

  return (
    <div className="relative animate-fade-in">
      {selectedProduct ? (
        <Card className="border-2 border-green-200 dark:border-green-800 animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-green-600 animate-bounce" />
                <div>
                  <h3 className="font-semibold text-green-700 dark:text-green-300">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ${selectedProduct.price} • {selectedProduct.barcode}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSelection}
                className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:scale-110 transition-all duration-300"
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-pulse" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="pl-10 border-2 focus:border-primary transition-all duration-300 hover:shadow-md"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {isOpen && products.length > 0 && (
            <Card className="absolute z-50 w-full mt-1 shadow-2xl border-2 animate-slide-in-up">
              <CardContent className="p-0 max-h-60 overflow-y-auto">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0 transition-all duration-200 hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-primary animate-bounce" />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${product.price} • {product.barcode}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {isOpen && searchTerm.length > 2 && products.length === 0 && !loading && (
            <Card className="absolute z-50 w-full mt-1 shadow-lg animate-scale-in">
              <CardContent className="p-4 text-center text-muted-foreground">
                No products found
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearchSelect;
