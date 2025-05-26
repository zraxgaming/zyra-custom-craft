
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Eye,
  Filter,
  Grid,
  List,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  status: string;
  category: string;
  images: string[];
  created_at: string;
  in_stock: boolean;
  featured: boolean;
  is_customizable: boolean;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products'
      }, () => {
        fetchProducts();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted",
      });
      
      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'draft':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 'archived':
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product, index) => (
        <Card 
          key={product.id} 
          className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-scale-in bg-card/60 backdrop-blur-sm border-border/50"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-t-lg">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="absolute top-2 right-2">
              <Badge className={getStatusColor(product.status)}>
                {product.status}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${product.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock:</span>
                <span className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock_quantity}
                </span>
              </div>
              {product.category && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-sm">{product.category}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                className="flex-1 hover:scale-105 transition-transform"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="hover:scale-105 transition-transform">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the product.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteProduct(product.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary to-purple-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl animate-float-reverse"></div>
        </div>

        <div className="relative z-10 p-6 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative mb-8">
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
                <Package className="h-5 w-5 mr-3" />
                Product Management
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
              Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-right">
              Manage your product catalog, inventory, and settings from one central location.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 animate-slide-in-left">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="hover:scale-110 transition-transform duration-200"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="hover:scale-110 transition-transform duration-200"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              onClick={() => navigate("/admin/products/new")}
              className="bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Products Display */}
          {filteredProducts.length === 0 ? (
            <Card className="animate-scale-in">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first product"}
                </p>
                <Button 
                  onClick={() => navigate("/admin/products/new")}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            renderGridView()
          ) : (
            <Card className="animate-fade-in bg-card/60 backdrop-blur-sm border-border/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product, index) => (
                    <TableRow 
                      key={product.id}
                      className="animate-fade-in hover:bg-muted/50 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Created {new Date(product.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category || "Uncategorized"}</TableCell>
                      <TableCell className="font-medium">${product.price}</TableCell>
                      <TableCell>
                        <span className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
                          {product.stock_quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:scale-110 transition-transform"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete "{product.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteProduct(product.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
