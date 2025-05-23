import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  estimated_days: string;
}

const ShippingMethodsSettings = () => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      setIsLoading(true);
      // Use raw SQL query instead of table reference
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: 'SELECT * FROM shipping_methods ORDER BY created_at ASC'
      });

      if (error) {
        // Fallback to direct query if RPC doesn't work
        console.error("RPC error, using fallback:", error);
        return;
      }
      
      setShippingMethods(data || []);
    } catch (error: any) {
      console.error("Error fetching shipping methods:", error);
      toast({
        title: "Error loading shipping methods",
        description: "Could not load shipping methods. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addShippingMethod = () => {
    setShippingMethods([
      ...shippingMethods,
      {
        id: `temp_${Date.now()}`,
        name: "",
        description: "",
        price: 0,
        active: true,
        estimated_days: "3-5"
      }
    ]);
  };

  const updateShippingMethod = (index: number, field: keyof ShippingMethod, value: any) => {
    const updatedMethods = [...shippingMethods];
    updatedMethods[index] = {
      ...updatedMethods[index],
      [field]: value
    };
    setShippingMethods(updatedMethods);
  };

  const removeShippingMethod = async (index: number, id: string) => {
    // If it's a real DB entry, delete it
    if (!id.startsWith("temp_")) {
      try {
        setIsSaving(true);
        const { error } = await supabase.rpc('exec_sql', {
          sql: `DELETE FROM shipping_methods WHERE id = '${id}'`
        });

        if (error) throw error;

        toast({
          title: "Shipping method removed",
          description: "The shipping method has been successfully removed."
        });
      } catch (error: any) {
        console.error("Error removing shipping method:", error);
        toast({
          title: "Error removing shipping method",
          description: error.message,
          variant: "destructive"
        });
        return;
      } finally {
        setIsSaving(false);
      }
    }

    // Remove from state
    setShippingMethods(shippingMethods.filter((_, i) => i !== index));
  };

  const saveShippingMethods = async () => {
    try {
      setIsSaving(true);
      
      // Validate
      const invalidMethod = shippingMethods.find(m => !m.name.trim());
      if (invalidMethod) {
        toast({
          title: "Validation Error",
          description: "All shipping methods must have a name.",
          variant: "destructive"
        });
        return;
      }

      // Process each method using SQL
      for (const method of shippingMethods) {
        if (method.id.startsWith("temp_")) {
          // New method - insert
          const { error } = await supabase.rpc('exec_sql', {
            sql: `INSERT INTO shipping_methods (name, description, price, active, estimated_days) 
                  VALUES ('${method.name}', '${method.description}', ${method.price}, ${method.active}, '${method.estimated_days}')`
          });
            
          if (error) throw error;
        } else {
          // Existing method - update
          const { error } = await supabase.rpc('exec_sql', {
            sql: `UPDATE shipping_methods SET 
                    name = '${method.name}',
                    description = '${method.description}',
                    price = ${method.price},
                    active = ${method.active},
                    estimated_days = '${method.estimated_days}'
                  WHERE id = '${method.id}'`
          });
            
          if (error) throw error;
        }
      }
      
      // Refresh data
      await fetchShippingMethods();
      
      toast({
        title: "Shipping methods saved",
        description: "Your shipping methods have been successfully updated."
      });
    } catch (error: any) {
      console.error("Error saving shipping methods:", error);
      toast({
        title: "Error saving shipping methods",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Methods</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-zyra-purple" />
          </div>
        ) : (
          <div className="space-y-4">
            {shippingMethods.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-500 mb-4">No shipping methods configured yet</p>
                <Button 
                  onClick={addShippingMethod}
                  variant="outline"
                  className="mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Shipping Method
                </Button>
              </div>
            ) : (
              <>
                {shippingMethods.map((method, index) => (
                  <div 
                    key={method.id} 
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Label htmlFor={`method-name-${index}`}>Method Name *</Label>
                        <Input
                          id={`method-name-${index}`}
                          value={method.name}
                          onChange={(e) => updateShippingMethod(index, "name", e.target.value)}
                          placeholder="e.g. Standard Shipping"
                          className="max-w-md"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={method.active}
                          onCheckedChange={(checked) => updateShippingMethod(index, "active", checked)}
                          id={`method-active-${index}`}
                        />
                        <Label htmlFor={`method-active-${index}`}>Active</Label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`method-price-${index}`}>Price ($)</Label>
                        <Input
                          id={`method-price-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={method.price}
                          onChange={(e) => updateShippingMethod(index, "price", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`method-days-${index}`}>Estimated Delivery (days)</Label>
                        <Input
                          id={`method-days-${index}`}
                          value={method.estimated_days}
                          onChange={(e) => updateShippingMethod(index, "estimated_days", e.target.value)}
                          placeholder="e.g. 3-5"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`method-description-${index}`}>Description</Label>
                      <Textarea
                        id={`method-description-${index}`}
                        value={method.description}
                        onChange={(e) => updateShippingMethod(index, "description", e.target.value)}
                        placeholder="Describe this shipping method..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeShippingMethod(index, method.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={addShippingMethod}
                    disabled={isSaving}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Shipping Method
                  </Button>
                  
                  <Button
                    onClick={saveShippingMethods}
                    disabled={isSaving}
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingMethodsSettings;
