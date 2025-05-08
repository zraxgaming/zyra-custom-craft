
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Search, Edit, Trash, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CategoryForm from "@/components/admin/CategoryForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Categories = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, isLoading, navigate, toast]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
          
      if (error) throw error;
      
      console.log("Categories fetched:", data);
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCategoriesLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchCategories();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('public:categories')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'categories' 
      }, () => {
        fetchCategories(); // Refresh data when categories change
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // Categories will refresh via real-time subscription
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredCategories = categories.filter((category: any) => 
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isCategoriesLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-muted rounded-lg p-12 text-center">
            <h3 className="text-xl font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Try a different search term or" : "Start by"} adding a new category.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category: any) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden">
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                            No img
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description || "—"}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/shop?category=${category.slug}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <CategoryForm 
            onSuccess={() => {
              setIsAddDialogOpen(false);
              // Categories will refresh via real-time subscription
            }} 
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Categories;
