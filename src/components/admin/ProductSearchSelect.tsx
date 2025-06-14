
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  images?: string[];
}

interface ProductSearchSelectProps {
  selectedProduct: Product | null;
  onProductSelect: (product: Product | null) => void;
  placeholder?: string;
}

const ProductSearchSelect: React.FC<ProductSearchSelectProps> = ({
  selectedProduct,
  onProductSelect,
  placeholder = "Search products..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
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
        .select('id, name, sku, price, images')
        .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
        .eq('status', 'published')
        .limit(10);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setIsOpen(false);
    setSearchTerm("");
  };

  const clearSelection = () => {
    onProductSelect(null);
  };

  return (
    <div className="relative">
      {selectedProduct ? (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
          <div className="flex items-center gap-3">
            {selectedProduct.images?.[0] && (
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-10 h-10 object-cover rounded"
              />
            )}
            <div>
              <p className="font-medium">{selectedProduct.name}</p>
              {selectedProduct.sku && (
                <p className="text-sm text-muted-foreground">SKU: {selectedProduct.sku}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSelection}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="pl-10"
            />
          </div>

          {isOpen && (searchTerm.length > 2 || products.length > 0) && (
            <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-hidden">
              <ScrollArea className="max-h-64">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="w-full p-3 text-left hover:bg-muted flex items-center gap-3 border-b last:border-b-0"
                      >
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {product.sku && <span>SKU: {product.sku}</span>}
                            <span>${product.price}</span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : searchTerm.length > 2 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No products found
                    </div>
                  ) : null}
                </CardContent>
              </ScrollArea>
            </Card>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductSearchSelect;
