
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

interface ProductSearchSelectProps {
  onProductSelect: (product: Product) => void;
  selectedProduct?: Product | null;
  placeholder?: string;
}

const ProductSearchSelect: React.FC<ProductSearchSelectProps> = ({ 
  onProductSelect, 
  selectedProduct, 
  placeholder = "Search products..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

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
        .eq('status', 'published')
        .limit(10);

      if (error) throw error;
      setProducts(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        title: "Error",
        description: "Failed to search products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setSearchTerm(product.name);
    setShowResults(false);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    if (selectedProduct && value !== selectedProduct.name) {
      // Clear selection if user types something different
      onProductSelect(null as any);
    }
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="product-search">Select Product</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          id="product-search"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 animate-fade-in"
          onFocus={() => searchTerm.length > 2 && setShowResults(true)}
        />
      </div>

      {showResults && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto animate-scale-in shadow-lg">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-1">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="p-3 hover:bg-accent cursor-pointer transition-colors animate-slide-in-up border-b last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          {product.sku && (
                            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-semibold">${product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No products found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedProduct && (
        <Card className="animate-fade-in border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-sm">{selectedProduct.name}</p>
                  {selectedProduct.sku && (
                    <p className="text-xs text-muted-foreground">SKU: {selectedProduct.sku}</p>
                  )}
                </div>
              </div>
              <span className="text-sm font-semibold text-primary">${selectedProduct.price}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductSearchSelect;
