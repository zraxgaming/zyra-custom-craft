
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save } from 'lucide-react';

interface CategoryFormProps {
  onSuccess: () => void;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
  };
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess, category }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    is_active: category?.is_active ?? true,
    sort_order: category?.sort_order || 0,
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
      slug: category ? prev.slug : generateSlug(name) // Only auto-generate for new categories
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description.trim() || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
        updated_at: new Date().toISOString()
      };

      if (category) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', category.id);
        
        if (error) throw error;
        
        toast({
          title: "Category updated",
          description: "Category has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            ...categoryData,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
        
        toast({
          title: "Category created",
          description: "New category has been created successfully.",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
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
            placeholder="Category name"
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
            placeholder="category-slug"
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Category description"
            rows={3}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            placeholder="0"
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full hover:scale-105 transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </Button>
      </form>
    </div>
  );
};

export default CategoryForm;
