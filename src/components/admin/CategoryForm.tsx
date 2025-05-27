
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
  };
  onSuccess: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    is_active: category?.is_active ?? true,
    sort_order: category?.sort_order || 0,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
      
      if (category) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            slug,
            description: formData.description,
            is_active: formData.is_active,
            sort_order: formData.sort_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', category.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            slug,
            description: formData.description,
            is_active: formData.is_active,
            sort_order: formData.sort_order,
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Category ${category ? 'updated' : 'created'} successfully`,
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="Auto-generated from name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
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
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : `${category ? 'Update' : 'Create'} Category`}
      </Button>
    </form>
  );
};

export default CategoryForm;
