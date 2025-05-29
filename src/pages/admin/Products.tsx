
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Package, Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Product interface
      const transformedProducts: Product[] = (data || []).map(product => ({
        ...product,
        images: Array.isArray(product.images) 
          ? product.images.filter(img => typeof img === 'string') as string[]
          : [],
        is_featured: product.is_featured || false,
        is_customizable: product.is_customizable || false,
        is_digital: product.is_digital || false,
        stock_quantity: product.stock_quantity || 0,
        customization_options: product.customization_options || {},
        is_published: product.status === 'published'
      }));

      setProducts(transformedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId);

      if (error) throw error;

      await fetchProducts();
      
      toast({
        title: "Success",
        description: `Product ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating product status:', error);
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      await fetchProducts();
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between animate-slide-in-left">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Product Management</h1>
            <Badge variant="secondary">{products.length} products</Badge>
          </div>
          <Link to="/admin/products/new">
            <Button className="hover:scale-105 transition-transform">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Search Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredProducts.map((product, index) => (
            <Card key={product.id} className="hover:shadow-lg transition-all duration-300 animate-slide-in-up" style={{animationDelay: `${index * 50}ms`}}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Price: <strong>${product.price}</strong></span>
                        {product.sku && <span>SKU: {product.sku}</span>}
                        <span>Stock: {product.stock_quantity}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                        {product.is_featured && <Badge variant="outline">Featured</Badge>}
                        {product.is_customizable && <Badge variant="outline">Customizable</Badge>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/product/${product.slug}`, '_blank')}
                      className="hover:scale-105 transition-transform"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Link to={`/admin/products/${product.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:scale-105 transition-transform"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(product.id, product.status || 'draft')}
                      className="hover:scale-105 transition-transform"
                    >
                      {product.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700 hover:scale-105 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="animate-scale-in">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Get started by adding your first product'
                }
              </p>
              {!searchTerm && (
                <Link to="/admin/products/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
