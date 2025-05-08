
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "@/components/admin/ProductForm";

const Products = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setIsProductsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
          
      if (error) throw error;
      
      console.log("Products fetched:", data);
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProductsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchProducts();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, () => {
        fetchProducts(); // Refresh data when products change
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // Products will refresh via real-time subscription
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter((product: any) => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold">Products</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isProductsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-muted rounded-lg p-12 text-center">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Try a different search term or" : "Start by"} adding a new product.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                            No img
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.in_stock 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/products/${product.slug}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProduct(product.id)}
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
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm 
            onSuccess={() => {
              setIsAddDialogOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Products;
