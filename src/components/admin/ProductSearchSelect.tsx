
import React, { useState, useEffect, useCallback } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area"; // Added import for ScrollArea
import { Json } from "@/integrations/supabase/types"; // Assuming Json type is defined here

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
  className?: string;
}

const ProductSearchSelect: React.FC<ProductSearchSelectProps> = ({
  selectedProduct,
  onProductSelect,
  placeholder = "Select a product...",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async (search: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, name, sku, price, images")
      .or(`name.ilike.%${search}%,sku.ilike.%${search}%`)
      .limit(10);

    if (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } else {
      const transformedProducts = (data || []).map(item => ({
        ...item,
        sku: item.sku || undefined,
        images: Array.isArray(item.images)
          ? item.images.filter((img): img is string => typeof img === 'string')
          : [],
      }));
      setProducts(transformedProducts);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1 || products.length === 0) {
      const timer = setTimeout(() => {
        fetchProducts(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, fetchProducts]);

  const handleSelect = (product: Product) => {
    onProductSelect(product);
    setOpen(false);
    setSearchTerm(""); 
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProductSelect(null);
    setSearchTerm("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">
            {selectedProduct ? selectedProduct.name : placeholder}
          </span>
          <div className="flex items-center">
            {selectedProduct && (
              <Button variant="ghost" size="sm" onClick={handleClear} className="mr-1 p-1 h-auto">
                <X className="h-3 w-3" />
              </Button>
            )}
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search product..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-9"
          />
          <CommandList>
            {isLoading && <CommandItem>Loading...</CommandItem>}
            {!isLoading && products.length === 0 && searchTerm.length > 1 && (
              <CommandEmpty>No product found.</CommandEmpty>
            )}
            {!isLoading && products.length > 0 && (
              <CommandGroup>
                <ScrollArea className="h-[200px]">
                  {products.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.name}
                      onSelect={() => handleSelect(product)}
                    >
                      {product.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSearchSelect;
