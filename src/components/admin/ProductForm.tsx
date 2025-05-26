
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
    name: "",
    description: "",
    short_description: "",
    price: "",
    category: "",
    images: "",
    stock_quantity: 0,
    sku: "",
    barcode: "",
    status: "published",
    in_stock: true,
    is_customizable: false,
    is_featured: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    if (product && product.id) {
      fetchProductData();
    }
  }, [product]);

  const fetchProductData = async () => {
    if (!product?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', product.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name || "",
          description: data.description || "",
          short_description: data.short_description || "",
          price: data.price?.toString() || "",
          category: data.category || "",
          images: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : "",
          stock_quantity: data.stock_quantity || 0,
          sku: data.sku || "",
          barcode: data.barcode || "",
          status: data.status || "published",
          in_stock: data.in_stock ?? true,
          is_customizable: data.is_customizable ?? false,
          is_featured: data.is_featured ?? false
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  // Auto-generate SKU when name changes (only for new products if SKU is empty)
  useEffect(() => {
    if (!product?.id && formData.name && !formData.sku) {
      const generatedSku = generateSKU(formData.name);
      setFormData(prev => ({ ...prev, sku: generatedSku }));
    }
  }, [formData.name, product]);

  // Auto-generate barcode when SKU changes (only for new products if barcode is empty)
  useEffect(() => {
    if (!product?.id && formData.sku && !formData.barcode) {
      const generatedBarcode = generateBarcode();
      setFormData(prev => ({ ...prev, barcode: generatedBarcode }));
    }
  }, [formData.sku, product]);

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

  const generateSKU = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  const generateBarcode = () => {
    // Generate a 13-digit EAN barcode
    const randomDigits = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    // Simple checksum calculation for EAN-13
    let checksum = 0;
    for (let i = 0; i < 12; i++) {
      checksum += parseInt(randomDigits[i]) * (i % 2 === 0 ? 1 : 3);
    }
    checksum = (10 - (checksum % 10)) % 10;
    return randomDigits + checksum.toString();
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

      if (product?.id) {
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
    <div className="bg-card rounded-lg border p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
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
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md transition-all duration-300 focus:ring-2 focus:ring-primary/20"
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
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="Auto-generated if empty"
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
              placeholder="Auto-generated if empty"
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
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
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <input
              id="in_stock"
              type="checkbox"
              checked={formData.in_stock}
              onChange={(e) => setFormData(prev => ({ ...prev, in_stock: e.target.checked }))}
              className="rounded border-border"
            />
            <Label htmlFor="in_stock">In Stock</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="is_customizable"
              type="checkbox"
              checked={formData.is_customizable}
              onChange={(e) => setFormData(prev => ({ ...prev, is_customizable: e.target.checked }))}
              className="rounded border-border"
            />
            <Label htmlFor="is_customizable">Customizable</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="is_featured"
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
              className="rounded border-border"
            />
            <Label htmlFor="is_featured">Featured</Label>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full hover:scale-105 transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : (product?.id ? "Update Product" : "Create Product")}
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;
