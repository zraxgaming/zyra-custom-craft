import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Plus, Edit, Trash2, Package, Eye, Sparkles } from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sku: "",
    stock_quantity: "",
    is_featured: false,
    is_customizable: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match Product interface with proper type handling
      const transformedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        price: Number(product.price) || 0,
        category: product.category || '',
        sku: product.sku || '',
        stock_quantity: Number(product.stock_quantity) || 0,
        is_featured: Boolean(product.is_featured),
        is_customizable: Boolean(product.is_customizable),
        slug: product.slug || '',
        in_stock: Boolean(product.in_stock),
        status: product.status || 'published',
        created_at: product.created_at || '',
        images: Array.isArray(product.images) 
          ? (product.images as any[]).map(img => typeof img === 'string' ? img : JSON.stringify(img))
          : []
      }));

      setProducts(transformedProducts);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        sku: formData.sku,
        stock_quantity: parseInt(formData.stock_quantity),
        is_featured: formData.is_featured,
        is_customizable: formData.is_customizable,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        in_stock: parseInt(formData.stock_quantity) > 0,
        status: 'published'
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Product updated",
          description: "Product has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Product created",
          description: "Product has been created successfully.",
        });
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error saving product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      sku: product.sku || "",
      stock_quantity: product.stock_quantity?.toString() || "0",
      is_featured: product.is_featured || false,
      is_customizable: product.is_customizable || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
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

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      sku: "",
      stock_quantity: "",
      is_featured: false,
      is_customizable: false,
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 relative overflow-hidden">
          <div className="relative z-10 p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
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

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 hover:scale-110 transition-transform duration-300 text-lg px-6 py-3" variant="outline">
              <Package className="h-5 w-5 mr-3" />
              Product Management
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
              Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-in-right">
              Manage your product catalog with advanced editing tools and real-time updates.
            </p>
          </div>

          {/* Action Button */}
          <div className="mb-6 animate-fade-in">
            <Button 
              onClick={() => {
                setShowForm(true);
                setEditingProduct(null);
                resetForm();
              }}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>

          {/* Product Form */}
          {showForm && (
            <Card className="mb-6 bg-card/60 backdrop-blur-sm border-border/50 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-4">
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300"
                    >
                      {editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                      className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="hover:shadow-xl transition-all duration-300 animate-scale-in bg-card/60 backdrop-blur-sm border-border/50 hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold mb-2 text-foreground">
                        {product.name}
                      </CardTitle>
                      <p className="text-xl font-bold text-primary">${product.price}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {product.is_featured && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-xs">
                          Featured
                        </Badge>
                      )}
                      {product.is_customizable && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-xs">
                          Custom
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Category:</strong> {product.category || "N/A"}</p>
                      <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
                      <p><strong>Stock:</strong> {product.stock_quantity || 0}</p>
                    </div>
                    
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="flex-1 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <Card className="text-center py-8 bg-card/60 backdrop-blur-sm border-border/50 animate-fade-in">
              <CardContent>
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">No products yet</h3>
                <p className="text-muted-foreground mb-4">Get started by creating your first product.</p>
                <Button 
                  onClick={() => {
                    setShowForm(true);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Product
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
