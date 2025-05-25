import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Plus, Minus, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock_quantity: number;
  price: number;
  category: string;
  status: string;
}

const InventoryManager = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantityChange, setQuantityChange] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku, stock_quantity, price, category, status")
        .eq("status", "published")
        .order("stock_quantity", { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching inventory",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStock = async (productId: string, change: number, type: 'increase' | 'decrease' | 'adjustment') => {
    try {
      const product = inventory.find(p => p.id === productId);
      if (!product) return;

      const newQuantity = Math.max(0, product.stock_quantity + change);

      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: newQuantity })
        .eq("id", productId);

      if (updateError) throw updateError;

      // Note: inventory_logs table will be created but we'll skip logging for now
      // since it requires the table to be properly set up in types

      toast({
        title: "Stock updated",
        description: `${product.name} stock updated to ${newQuantity}`,
      });

      fetchInventory();
      setQuantityChange(0);
      setReason("");
    } catch (error: any) {
      toast({
        title: "Error updating stock",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const, icon: AlertTriangle };
    if (quantity < 10) return { label: "Low Stock", variant: "secondary" as const, icon: TrendingDown };
    return { label: "In Stock", variant: "default" as const, icon: TrendingUp };
  };

  const lowStockCount = inventory.filter(item => item.stock_quantity < 10).length;
  const outOfStockCount = inventory.filter(item => item.stock_quantity === 0).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock_quantity * item.price), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Inventory Manager</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{inventory.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800 animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{outOfStockCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{lowStockCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 animate-scale-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stock Update */}
      <Card className="bg-card border-border animate-slide-in-right" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Package className="h-5 w-5" />
            Quick Stock Update
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="">Select Product</option>
              {inventory.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Current: {product.stock_quantity})
                </option>
              ))}
            </select>

            <Input
              type="number"
              placeholder="Quantity change"
              value={quantityChange || ""}
              onChange={(e) => setQuantityChange(parseInt(e.target.value) || 0)}
              className="bg-background text-foreground border-border"
            />

            <Input
              placeholder="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-background text-foreground border-border"
            />

            <div className="flex gap-2">
              <Button
                onClick={() => selectedProduct && updateStock(selectedProduct, Math.abs(quantityChange), 'increase')}
                disabled={!selectedProduct || quantityChange <= 0}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button
                onClick={() => selectedProduct && updateStock(selectedProduct, -Math.abs(quantityChange), 'decrease')}
                disabled={!selectedProduct || quantityChange <= 0}
                size="sm"
                variant="destructive"
              >
                <Minus className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="bg-card border-border animate-fade-in" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="text-foreground">Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-foreground">Product</TableHead>
                  <TableHead className="text-foreground">SKU</TableHead>
                  <TableHead className="text-foreground">Category</TableHead>
                  <TableHead className="text-foreground">Stock</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Value</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item, index) => {
                  const status = getStockStatus(item.stock_quantity);
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={item.id} className="border-border animate-fade-in" style={{ animationDelay: `${600 + index * 50}ms` }}>
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-foreground">{item.sku || '—'}</TableCell>
                      <TableCell className="text-foreground">{item.category}</TableCell>
                      <TableCell className="text-foreground font-mono">{item.stock_quantity}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">${(item.stock_quantity * item.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStock(item.id, 1, 'increase')}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStock(item.id, -1, 'decrease')}
                            disabled={item.stock_quantity === 0}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
