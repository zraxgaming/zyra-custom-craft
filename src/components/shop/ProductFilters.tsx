
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  categories: { name: string; id: string }[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  showInStockOnly: boolean;
  onShowInStockChange: (value: boolean) => void;
  onResetFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  showInStockOnly,
  onShowInStockChange,
  onResetFilters,
}) => {
  const toggleCategory = (category: string) => {
    onCategoryChange(category);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-medium text-foreground">Filters</h3>
        <Button
          variant="link"
          className="mt-2 px-0 text-sm hover:text-primary transition-colors"
          onClick={onResetFilters}
        >
          Reset all filters
        </Button>
      </div>

      <Accordion type="multiple" className="w-full" defaultValue={["categories", "price"]}>
        <AccordionItem value="categories" className="animate-fade-in">
          <AccordionTrigger className="hover:text-primary transition-colors">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2 animate-scale-in">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => toggleCategory(category.name)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="cursor-pointer text-sm hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="animate-fade-in">
          <AccordionTrigger className="hover:text-primary transition-colors">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                value={[priceRange[0], priceRange[1]]}
                min={0}
                max={maxPrice}
                step={5}
                onValueChange={(values) => onPriceRangeChange([values[0], values[1]])}
                className="py-4"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stock" className="animate-fade-in">
          <AccordionTrigger className="hover:text-primary transition-colors">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={showInStockOnly}
                onCheckedChange={(checked) => onShowInStockChange(checked as boolean)}
              />
              <Label htmlFor="in-stock" className="cursor-pointer text-sm hover:text-primary transition-colors">
                Show in-stock items only
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilters;
