import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash, CreditCard, Paypal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  code: string;
  active: boolean;
  icon: string;
  requires_setup: boolean;
  setup_data: any;
}

const PaymentMethodsSettings = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      setPaymentMethods(data || []);
      
      // If no payment methods exist, add default ones
      if (!data || data.length === 0) {
        setPaymentMethods([
          {
            id: "temp_paypal",
            name: "PayPal",
            description: "Pay with PayPal or credit card",
            code: "paypal",
            active: true,
            icon: "paypal",
            requires_setup: true,
            setup_data: {}
          },
          {
            id: "temp_stripe",
            name: "Credit Card",
            description: "Pay with credit or debit card",
            code: "stripe",
            active: false,
            icon: "credit-card",
            requires_setup: true,
            setup_data: {}
          },
          {
            id: "temp_cod",
            name: "Cash on Delivery",
            description: "Pay when you receive the product",
            code: "cod",
            active: true,
            icon: "dollar",
            requires_setup: false,
            setup_data: {}
          }
        ]);
      }
    } catch (error: any) {
      console.error("Error fetching payment methods:", error);
      toast({
        title: "Error loading payment methods",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = () => {
    setPaymentMethods([
      ...paymentMethods,
      {
        id: `temp_${Date.now()}`,
        name: "",
        description: "",
        code: "",
        active: true,
        icon: "credit-card",
        requires_setup: false,
        setup_data: {}
      }
    ]);
  };

  const updatePaymentMethod = (index: number, field: keyof PaymentMethod, value: any) => {
    const updatedMethods = [...paymentMethods];
    updatedMethods[index] = {
      ...updatedMethods[index],
      [field]: value
    };
    setPaymentMethods(updatedMethods);
  };

  const updateSetupData = (index: number, field: string, value: any) => {
    const updatedMethods = [...paymentMethods];
    updatedMethods[index] = {
      ...updatedMethods[index],
      setup_data: {
        ...updatedMethods[index].setup_data,
        [field]: value
      }
    };
    setPaymentMethods(updatedMethods);
  };

  const removePaymentMethod = async (index: number, id: string) => {
    // Don't allow removing built-in methods
    if (id === "temp_paypal" || id === "temp_stripe" || id === "temp_cod") {
      toast({
        title: "Cannot remove default payment methods",
        description: "The default payment methods cannot be removed, only deactivated.",
        variant: "destructive"
      });
      return;
    }
    
    // If it's a real DB entry, delete it
    if (!id.startsWith("temp_")) {
      try {
        setIsSaving(true);
        const { error } = await supabase
          .from("payment_methods")
          .delete()
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Payment method removed",
          description: "The payment method has been successfully removed."
        });
      } catch (error: any) {
        console.error("Error removing payment method:", error);
        toast({
          title: "Error removing payment method",
          description: error.message,
          variant: "destructive"
        });
        return;
      } finally {
        setIsSaving(false);
      }
    }

    // Remove from state
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const savePaymentMethods = async () => {
    try {
      setIsSaving(true);
      
      // Validate
      const invalidMethod = paymentMethods.find(m => !m.name.trim() || !m.code.trim());
      if (invalidMethod) {
        toast({
          title: "Validation Error",
          description: "All payment methods must have a name and code.",
          variant: "destructive"
        });
        return;
      }

      // Process each method
      for (const method of paymentMethods) {
        if (method.id.startsWith("temp_")) {
          // New method - insert
          const { id, ...methodData } = method;
          const { error } = await supabase
            .from("payment_methods")
            .insert(methodData);
            
          if (error) throw error;
        } else {
          // Existing method - update
          const { error } = await supabase
            .from("payment_methods")
            .update({
              name: method.name,
              description: method.description,
              code: method.code,
              active: method.active,
              icon: method.icon,
              requires_setup: method.requires_setup,
              setup_data: method.setup_data
            })
            .eq("id", method.id);
            
          if (error) throw error;
        }
      }
      
      // Refresh data
      await fetchPaymentMethods();
      
      toast({
        title: "Payment methods saved",
        description: "Your payment methods have been successfully updated."
      });
    } catch (error: any) {
      console.error("Error saving payment methods:", error);
      toast({
        title: "Error saving payment methods",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderPaymentMethodSetup = (method: PaymentMethod, index: number) => {
    if (!method.requires_setup) return null;
    
    switch (method.code) {
      case 'paypal':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-4">
            <h4 className="font-medium">PayPal Configuration</h4>
            <div className="space-y-2">
              <Label htmlFor={`client-id-${index}`}>Client ID</Label>
              <Input
                id={`client-id-${index}`}
                value={method.setup_data?.client_id || ''}
                onChange={(e) => updateSetupData(index, "client_id", e.target.value)}
                placeholder="Your PayPal Client ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`secret-${index}`}>Secret</Label>
              <Input
                id={`secret-${index}`}
                type="password"
                value={method.setup_data?.client_secret || ''}
                onChange={(e) => updateSetupData(index, "client_secret", e.target.value)}
                placeholder="Your PayPal Secret"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`sandbox-${index}`}
                  checked={method.setup_data?.sandbox || false}
                  onCheckedChange={(checked) => updateSetupData(index, "sandbox", checked)}
                />
                <Label htmlFor={`sandbox-${index}`}>Sandbox Mode</Label>
              </div>
              <p className="text-xs text-gray-500">Enable for testing with sandbox accounts</p>
            </div>
          </div>
        );
      case 'stripe':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-4">
            <h4 className="font-medium">Stripe Configuration</h4>
            <div className="space-y-2">
              <Label htmlFor={`api-key-${index}`}>API Key</Label>
              <Input
                id={`api-key-${index}`}
                type="password"
                value={method.setup_data?.api_key || ''}
                onChange={(e) => updateSetupData(index, "api_key", e.target.value)}
                placeholder="Your Stripe API Key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`webhook-secret-${index}`}>Webhook Secret</Label>
              <Input
                id={`webhook-secret-${index}`}
                type="password"
                value={method.setup_data?.webhook_secret || ''}
                onChange={(e) => updateSetupData(index, "webhook_secret", e.target.value)}
                placeholder="Your Stripe Webhook Secret"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getMethodIcon = (code: string) => {
    switch (code) {
      case 'paypal':
        return <Paypal className="h-5 w-5" />;
      case 'stripe':
      case 'credit-card':
        return <CreditCard className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-zyra-purple" />
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-500 mb-4">No payment methods configured yet</p>
                <Button 
                  onClick={addPaymentMethod}
                  variant="outline"
                  className="mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Payment Method
                </Button>
              </div>
            ) : (
              <>
                {paymentMethods.map((method, index) => (
                  <div 
                    key={method.id} 
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-md">
                          {getMethodIcon(method.code)}
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`method-name-${index}`}>Method Name *</Label>
                          <Input
                            id={`method-name-${index}`}
                            value={method.name}
                            onChange={(e) => updatePaymentMethod(index, "name", e.target.value)}
                            placeholder="e.g. Credit Card"
                            className="max-w-md"
                            disabled={method.id === "temp_paypal" || method.id === "temp_stripe" || method.id === "temp_cod"}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={method.active}
                          onCheckedChange={(checked) => updatePaymentMethod(index, "active", checked)}
                          id={`method-active-${index}`}
                        />
                        <Label htmlFor={`method-active-${index}`}>Active</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`method-description-${index}`}>Description</Label>
                      <Textarea
                        id={`method-description-${index}`}
                        value={method.description}
                        onChange={(e) => updatePaymentMethod(index, "description", e.target.value)}
                        placeholder="Describe this payment method..."
                        rows={2}
                      />
                    </div>
                    
                    {renderPaymentMethodSetup(method, index)}
                    
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePaymentMethod(index, method.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        disabled={method.id === "temp_paypal" || method.id === "temp_stripe" || method.id === "temp_cod"}
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
                    onClick={addPaymentMethod}
                    disabled={isSaving}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                  
                  <Button
                    onClick={savePaymentMethods}
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

export default PaymentMethodsSettings;
