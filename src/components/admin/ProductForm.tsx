
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Package } from "lucide-react";

interface ProductFormProps {
  onSuccess: () => void;
  product?: any;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, product }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    short_description: product?.short_description || "",
    price: product?.price || "",
    category: product?.category || "",
    images: product?.images?.[0] || "",
    stock_quantity: product?.stock_quantity || 0,
    sku: product?.sku || "",
    status: product?.status || "draft",
    in_stock: product?.in_stock ?? true,
    is_customizable: product?.is_customizable ?? false,
    is_featured: product?.is_featured ?? false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const slug = generateSlug(formData.name);
      
      const productData = {
        ...formData,
        slug,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
        images: formData.images ? [formData.images] : []
      };

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        
        if (error) throw error;
        
        toast({
          title: "Product updated",
          description: "The product has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        
        if (error) throw error;
        
        toast({
          title: "Product created",
          description: "The product has been created successfully.",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-md"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_quantity">Stock Quantity</Label>
          <Input
            id="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Image URL</Label>
        <Input
          id="images"
          type="url"
          value={formData.images}
          onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <input
            id="in_stock"
            type="checkbox"
            checked={formData.in_stock}
            onChange={(e) => setFormData(prev => ({ ...prev, in_stock: e.target.checked }))}
          />
          <Label htmlFor="in_stock">In Stock</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="is_customizable"
            type="checkbox"
            checked={formData.is_customizable}
            onChange={(e) => setFormData(prev => ({ ...prev, is_customizable: e.target.checked }))}
          />
          <Label htmlFor="is_customizable">Customizable</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="is_featured"
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
          />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? "Saving..." : (product ? "Update Product" : "Create Product")}
      </Button>
    </form>
  );
};

export default ProductForm;
