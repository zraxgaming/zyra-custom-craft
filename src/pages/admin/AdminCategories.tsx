
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Tag, Eye, EyeOff, Sparkles } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    icon: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const slug = generateSlug(formData.name);
      const categoryData = {
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null,
        icon: formData.icon.trim() || null,
        is_active: true,
        sort_order: categories.length
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: "Success ✨",
          description: "Category updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(categoryData);

        if (error) throw error;

        toast({
          title: "Success ✨",
          description: "Category created successfully",
        });
      }

      setFormData({ name: "", description: "", image_url: "", icon: "" });
      setIsCreating(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Category ${category.is_active ? 'deactivated' : 'activated'}`,
      });

      fetchCategories();
    } catch (error: any) {
      console.error('Error toggling category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
      icon: category.icon || ""
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", image_url: "", icon: "" });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <SEOHead 
        title="Categories Management - Admin Dashboard"
        description="Manage product categories, organize your inventory, and control category visibility."
      />
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-scale-in">
                Categories Management
              </h1>
              <p className="text-muted-foreground mt-2 animate-slide-in-right">
                Organize your products with categories
              </p>
            </div>
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
            >
              <Plus className="h-4 w-4 mr-2 animate-bounce" />
              Add Category
            </Button>
          </div>

          {isCreating && (
            <Card className="animate-scale-in border-primary/20 shadow-lg hover:shadow-xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="animate-slide-in-left">
                      <label className="text-sm font-medium mb-2 block">Category Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Custom T-Shirts"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="animate-slide-in-right">
                      <label className="text-sm font-medium mb-2 block">Icon (Lucide name)</label>
                      <Input
                        value={formData.icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                        placeholder="e.g., shirt, package, star"
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  
                  <div className="animate-fade-in">
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of this category..."
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div className="animate-slide-in-up">
                    <label className="text-sm font-medium mb-2 block">Image URL</label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/category-image.jpg"
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300"
                    >
                      <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                      {editingCategory ? 'Update' : 'Create'} Category
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {categories.map((category, index) => (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-500 animate-slide-in-up border border-border/50 bg-card/60 backdrop-blur-sm" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {category.image_url && (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded-lg animate-scale-in"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg animate-text-shimmer">{category.name}</h3>
                          <Badge variant={category.is_active ? 'default' : 'secondary'} className="animate-pulse">
                            {category.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{category.description}</p>
                        <p className="text-xs text-muted-foreground">Slug: {category.slug}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(category)}
                        className="hover:scale-105 transition-all duration-300"
                      >
                        {category.is_active ? (
                          <EyeOff className="h-4 w-4 animate-pulse" />
                        ) : (
                          <Eye className="h-4 w-4 animate-pulse" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="hover:scale-105 transition-all duration-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(category)}
                        className="hover:scale-105 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4 animate-pulse" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {categories.length === 0 && (
              <Card className="p-12 text-center animate-bounce-in">
                <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-float" />
                <h3 className="text-lg font-semibold mb-2">No Categories Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first category to organize your products</p>
                <Button onClick={() => setIsCreating(true)} className="hover:scale-105 transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              </Card>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminCategories;
