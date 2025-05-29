
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Package, Search, TrendingUp, TrendingDown, AlertTriangle, Check } from "lucide-react";

const InventoryManager = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateQuantities, setUpdateQuantities] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('stock_quantity', { ascending: true });

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
        description: "Failed to load inventory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newQuantity,
          in_stock: newQuantity > 0,
          stock_status: newQuantity > 0 ? 'in_stock' : 'out_of_stock'
        })
        .eq('id', productId);

      if (error) throw error;

      await fetchProducts();
      setUpdateQuantities(prev => ({ ...prev, [productId]: '' }));
      
      toast({
        title: "Success",
        description: "Stock quantity updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock quantity",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => (p.stock_quantity || 0) < 10);
  const outOfStockProducts = products.filter(p => (p.stock_quantity || 0) === 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 animate-fade-in">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-2xl transition-all duration-300 animate-slide-in-left">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Products</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{products.length}</p>
              </div>
              <Package className="h-12 w-12 text-green-500 animate-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 hover:shadow-2xl transition-all duration-300 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Low Stock</p>
                <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{lowStockProducts.length}</p>
              </div>
              <TrendingDown className="h-12 w-12 text-yellow-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 hover:shadow-2xl transition-all duration-300 animate-slide-in-right">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Out of Stock</p>
                <p className="text-3xl font-bold text-red-700 dark:text-red-300">{outOfStockProducts.length}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-500 animate-wiggle" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative animate-fade-in">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-lg border-2 focus:border-purple-500 transition-all duration-300 hover:shadow-lg"
        />
      </div>

      {/* Products List */}
      <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm animate-slide-in-up">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Update Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.images?.[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform duration-300"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">${product.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">
                      {product.sku || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {product.stock_quantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(product.stock_quantity || 0) === 0 ? (
                        <Badge variant="destructive" className="animate-pulse">
                          Out of Stock
                        </Badge>
                      ) : (product.stock_quantity || 0) < 10 ? (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 animate-bounce">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <Check className="h-3 w-3 mr-1" />
                          In Stock
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="New quantity"
                          value={updateQuantities[product.id] || ''}
                          onChange={(e) => setUpdateQuantities(prev => ({ ...prev, [product.id]: e.target.value }))}
                          className="w-32 h-10 border-2 focus:border-purple-500 transition-all duration-300"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            const quantity = parseInt(updateQuantities[product.id] || '0');
                            if (!isNaN(quantity) && quantity >= 0) {
                              updateStock(product.id, quantity);
                            }
                          }}
                          disabled={!updateQuantities[product.id]}
                          className="h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
                        >
                          Update
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 animate-bounce-in">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Products Found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
