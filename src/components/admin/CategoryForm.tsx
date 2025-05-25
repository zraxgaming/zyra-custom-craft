
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Image, Save } from "lucide-react";

interface CategoryFormProps {
  onSuccess: () => void;
  category?: any;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess, category }) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    image_url: category?.image_url || "",
    icon: category?.icon || "",
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active ?? true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const slug = generateSlug(formData.name);
      
      const categoryData = {
        ...formData,
        slug,
        sort_order: Number(formData.sort_order)
      };

      if (category) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', category.id);
        
        if (error) throw error;
        
        toast({
          title: "Category updated",
          description: "The category has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(categoryData);
        
        if (error) throw error;
        
        toast({
          title: "Category created",
          description: "The category has been created successfully.",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
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

      <div className="space-y-2">
        <Label htmlFor="image_url" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Image URL
        </Label>
        <Input
          id="image_url"
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon (Emoji)</Label>
        <Input
          id="icon"
          value={formData.icon}
          onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
          placeholder="📱"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input
          id="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="is_active"
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? "Saving..." : (category ? "Update Category" : "Create Category")}
      </Button>
    </form>
  );
};

export default CategoryForm;
