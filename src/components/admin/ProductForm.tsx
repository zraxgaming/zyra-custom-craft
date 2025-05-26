
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save } from 'lucide-react';

interface ProductFormProps {
  onSuccess: () => void;
  product?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    images: string[];
    is_featured: boolean;
    is_customizable: boolean;
    stock_quantity: number;
  };
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, product }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    images: product?.images || [],
    is_featured: product?.is_featured || false,
    is_customizable: product?.is_customizable || false,
    stock_quantity: product?.stock_quantity || 0,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: product ? prev.slug : generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description.trim() || null,
        price: formData.price,
        images: formData.images.map(img => String(img)),
        is_featured: formData.is_featured,
        is_customizable: formData.is_customizable,
        stock_quantity: formData.stock_quantity,
        status: 'published',
        updated_at: new Date().toISOString()
      };

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        
        if (error) throw error;
        
        toast({
          title: "Product updated",
          description: "Product has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert({
            ...productData,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
        
        toast({
          title: "Product created",
          description: "New product has been created successfully.",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Product name"
            required
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="product-slug"
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Product description"
            rows={3}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            placeholder="0.00"
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_quantity">Stock Quantity</Label>
          <Input
            id="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
            placeholder="0"
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
            />
            <Label htmlFor="is_featured">Featured</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_customizable"
              checked={formData.is_customizable}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_customizable: checked }))}
            />
            <Label htmlFor="is_customizable">Customizable</Label>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full hover:scale-105 transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;
