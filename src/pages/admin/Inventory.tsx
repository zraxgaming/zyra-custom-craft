
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Package, AlertTriangle, Plus, Minus, Search, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock_quantity: number;
  price: number;
  status: string;
  images: string[];
}

const AdminInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, stock_quantity, price, status, images')
        .order('name');

      if (error) throw error;

      const transformedInventory: InventoryItem[] = (data || []).map(item => ({
        ...item,
        images: Array.isArray(item.images) 
          ? item.images.filter(img => typeof img === 'string') as string[]
          : []
      }));

      setInventory(transformedInventory);
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

  const handleStockUpdate = async () => {
    if (!selectedProduct) return;

    try {
      const newQuantity = selectedProduct.stock_quantity + stockAdjustment;
      
      if (newQuantity < 0) {
        toast({
          title: "Invalid quantity",
          description: "Stock quantity cannot be negative",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      setInventory(inventory.map(item => 
        item.id === selectedProduct.id 
          ? { ...item, stock_quantity: newQuantity }
          : item
      ));

      setIsDialogOpen(false);
      setSelectedProduct(null);
      setStockAdjustment(0);

      toast({
        title: "Success",
        description: "Stock quantity updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock quantity",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity <= 10) return { label: "Low Stock", variant: "destructive" as const };
    if (quantity <= 25) return { label: "Medium Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.stock_quantity <= 10);
  const outOfStockItems = inventory.filter(item => item.stock_quantity === 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.stock_quantity), 0);

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
        <div className="flex items-center justify-between animate-slide-in-left">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="animate-scale-in hover-3d-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-bounce-in">{inventory.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in hover-3d-lift" style={{animationDelay: '0.1s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 animate-bounce-in">{outOfStockItems.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in hover-3d-lift" style={{animationDelay: '0.2s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 animate-bounce-in">{lowStockItems.length}</div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in hover-3d-lift" style={{animationDelay: '0.3s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 animate-bounce-in">${totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

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
                className="pl-10 hover-magnetic"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredInventory.map((item, index) => {
            const stockStatus = getStockStatus(item.stock_quantity);
            return (
              <Card key={item.id} className="animate-slide-in-up hover:shadow-lg transition-all duration-300 hover-3d-lift" style={{animationDelay: `${index * 50}ms`}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden animate-scale-in">
                        {item.images && item.images.length > 0 ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="w-full h-full object-cover hover-3d-lift"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.sku || 'N/A'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.label}
                          </Badge>
                          <span className="text-sm font-medium">
                            {item.stock_quantity} units
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          Value: ${(item.price * item.stock_quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(item);
                          setIsDialogOpen(true);
                        }}
                        className="hover-3d-lift"
                      >
                        Adjust Stock
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stock Adjustment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="animate-scale-in">
            <DialogHeader>
              <DialogTitle>Adjust Stock - {selectedProduct?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Stock</Label>
                <p className="text-lg font-semibold">{selectedProduct?.stock_quantity || 0} units</p>
              </div>
              
              <div>
                <Label htmlFor="adjustment">Stock Adjustment</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setStockAdjustment(stockAdjustment - 1)}
                    className="hover-3d-lift"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="adjustment"
                    type="number"
                    value={stockAdjustment}
                    onChange={(e) => setStockAdjustment(parseInt(e.target.value) || 0)}
                    className="text-center hover-magnetic"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setStockAdjustment(stockAdjustment + 1)}
                    className="hover-3d-lift"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>New Stock Level</Label>
                <p className="text-lg font-semibold text-primary">
                  {(selectedProduct?.stock_quantity || 0) + stockAdjustment} units
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleStockUpdate} className="hover-3d-lift">
                  Update Stock
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedProduct(null);
                    setStockAdjustment(0);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
