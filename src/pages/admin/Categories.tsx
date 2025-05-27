
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FolderOpen, Plus, Edit, Trash2, Save, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    icon: '',
    is_active: true
  });
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast({
        title: "Name Required",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-');
      
      const { error } = await supabase
        .from('categories')
        .insert({
          ...newCategory,
          slug
        });

      if (error) throw error;

      toast({
        title: "Category Created",
        description: "Category has been created successfully"
      });

      setNewCategory({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        icon: '',
        is_active: true
      });
      
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from('categories')
        .update(editingCategory)
        .eq('id', editingCategory.id);

      if (error) throw error;

      toast({
        title: "Category Updated",
        description: "Category has been updated successfully"
      });

      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully"
      });

      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FolderOpen className="h-8 w-8" />
            Category Management
          </h1>
        </div>

        {/* Create New Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({...prev, name: e.target.value}))}
                  placeholder="Category name"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory(prev => ({...prev, slug: e.target.value}))}
                  placeholder="category-slug"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({...prev, description: e.target.value}))}
                placeholder="Category description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={newCategory.image_url}
                  onChange={(e) => setNewCategory(prev => ({...prev, image_url: e.target.value}))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory(prev => ({...prev, icon: e.target.value}))}
                  placeholder="category-icon"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newCategory.is_active}
                onCheckedChange={(checked) => setNewCategory(prev => ({...prev, is_active: checked}))}
              />
              <Label>Active</Label>
            </div>

            <Button onClick={handleCreateCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>Categories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  {editingCategory?.id === category.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory(prev => ({...prev, name: e.target.value}))}
                          />
                        </div>
                        <div>
                          <Label>Slug</Label>
                          <Input
                            value={editingCategory.slug}
                            onChange={(e) => setEditingCategory(prev => ({...prev, slug: e.target.value}))}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={editingCategory.description || ''}
                          onChange={(e) => setEditingCategory(prev => ({...prev, description: e.target.value}))}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editingCategory.is_active}
                          onCheckedChange={(checked) => setEditingCategory(prev => ({...prev, is_active: checked}))}
                        />
                        <Label>Active</Label>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleUpdateCategory}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditingCategory(null)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {category.image_url && (
                          <img src={category.image_url} alt={category.name} className="w-12 h-12 object-cover rounded" />
                        )}
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.slug}</p>
                          {category.description && (
                            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={category.is_active} disabled />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
