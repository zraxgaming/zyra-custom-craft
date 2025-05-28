
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductManager = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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

      const transformedProducts: Product[] = (data || []).map(product => ({
        ...product,
        images: Array.isArray(product.images) 
          ? product.images.filter(img => typeof img === 'string') as string[]
          : [],
        is_featured: product.is_featured || false,
        is_customizable: product.is_customizable || false,
        stock_quantity: product.stock_quantity || 0
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Product Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')} className="btn-premium hover-3d-lift">
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <Card className="glass-card border-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hover-magnetic"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'No products match your search criteria.' : 'Start by adding your first product.'}
              </p>
              <Button onClick={() => navigate('/admin/products/new')} className="btn-premium">
                <Plus className="h-4 w-4 mr-2" />
                Add First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredProducts.map((product, index) => (
            <Card key={product.id} className="glass-card border-gradient hover-3d-lift animate-slide-in-up" style={{animationDelay: `${index * 50}ms`}}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg border-2 border-border"
                    />
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${product.price} • Stock: {product.stock_quantity}
                      </p>
                      {product.sku && (
                        <p className="text-xs text-muted-foreground font-mono">
                          SKU: {product.sku}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                          {product.status || 'draft'}
                        </Badge>
                        {product.is_featured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                        {product.is_customizable && (
                          <Badge variant="outline">Customizable</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/product/${product.id}`, '_blank')}
                      className="hover-magnetic"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      className="hover-magnetic"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="hover-3d-lift"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductManager;
