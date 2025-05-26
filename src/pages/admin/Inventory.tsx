
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Search, AlertTriangle, TrendingUp, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock_quantity: number;
  price: number;
  images: string[];
  status: string;
  in_stock: boolean;
}

const AdminInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStock, setEditingStock] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, stock_quantity, price, images, status, in_stock')
        .order('name', { ascending: true });

      if (error) throw error;

      const transformedData: InventoryItem[] = (data || []).map(item => ({
        ...item,
        images: Array.isArray(item.images) 
          ? item.images.filter((img: any) => typeof img === 'string')
          : []
      }));

      setInventory(transformedData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newStock,
          in_stock: newStock > 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      setInventory(prev => prev.map(item => 
        item.id === productId 
          ? { ...item, stock_quantity: newStock, in_stock: newStock > 0 }
          : item
      ));

      setEditingStock(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });

      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.stock_quantity <= 5 && item.stock_quantity > 0);
  const outOfStockItems = inventory.filter(item => item.stock_quantity === 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold animate-slide-in-left">Inventory Management</h1>
          <div className="flex gap-4 animate-slide-in-right">
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="font-medium">{inventory.length} Products</span>
              </div>
            </Card>
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{lowStockItems.length} Low Stock</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-scale-in border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">In Stock</p>
                  <p className="text-3xl font-bold text-green-700">
                    {inventory.filter(item => item.in_stock).length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in border-yellow-200 bg-yellow-50" style={{animationDelay: '100ms'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Low Stock</p>
                  <p className="text-3xl font-bold text-yellow-700">{lowStockItems.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in border-red-200 bg-red-50" style={{animationDelay: '200ms'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Out of Stock</p>
                  <p className="text-3xl font-bold text-red-700">{outOfStockItems.length}</p>
                </div>
                <Package className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="animate-slide-in-up">
          <CardHeader>
            <CardTitle>Search Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInventory.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in-up" style={{animationDelay: `${index * 50}ms`}}>
                  <div className="flex items-center gap-4">
                    <img
                      src={item.images[0] || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku || 'N/A'}</p>
                      <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Stock</p>
                      {editingStock[item.id] !== undefined ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={editingStock[item.id]}
                            onChange={(e) => setEditingStock(prev => ({
                              ...prev,
                              [item.id]: parseInt(e.target.value) || 0
                            }))}
                            className="w-20 text-center"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleStockUpdate(item.id, editingStock[item.id])}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingStock(prev => {
                              const updated = { ...prev };
                              delete updated[item.id];
                              return updated;
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold">{item.stock_quantity}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingStock(prev => ({
                              ...prev,
                              [item.id]: item.stock_quantity
                            }))}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <Badge 
                      variant={item.in_stock ? 'default' : 'destructive'}
                      className={item.stock_quantity <= 5 && item.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' : ''}
                    >
                      {item.stock_quantity === 0 ? 'Out of Stock' : 
                       item.stock_quantity <= 5 ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </div>
                </div>
              ))}

              {filteredInventory.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Products Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "No products match your search." : "No products in inventory."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
