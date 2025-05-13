
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Settings2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

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
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    // Instead of trying to fetch from a payment_methods table that doesn't exist,
    // we'll use site_config to store payment gateway configurations
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .eq("key", "payment_methods");

    if (error) {
      console.error("Error fetching payment methods:", error);
      toast({
        title: "Error",
        description: "Failed to load payment methods",
        variant: "destructive",
      });
      return;
    }

    // If payment methods config exists, parse it
    if (data && data.length > 0) {
      try {
        const methodsData = JSON.parse(data[0].value || "[]");
        setPaymentMethods(methodsData);
      } catch (e) {
        console.error("Error parsing payment methods:", e);
        setPaymentMethods([]);
      }
    } else {
      // Initialize with default payment methods
      const defaultPaymentMethods: PaymentMethod[] = [
        {
          id: "paypal",
          name: "PayPal",
          description: "Allow customers to pay with PayPal",
          code: "paypal",
          active: true,
          icon: "credit-card",
          requires_setup: true,
          setup_data: {
            client_id: "",
            secret_key: "",
            sandbox_mode: true,
          },
        },
        {
          id: "stripe",
          name: "Stripe",
          description: "Accept credit cards via Stripe",
          code: "stripe",
          active: false,
          icon: "credit-card",
          requires_setup: true,
          setup_data: {
            publishable_key: "",
            secret_key: "",
            test_mode: true,
          },
        },
        {
          id: "cod",
          name: "Cash on Delivery",
          description: "Pay when you receive the order",
          code: "cod",
          active: true,
          icon: "dollar-sign",
          requires_setup: false,
          setup_data: {},
        },
      ];

      // Save default methods to the database
      await savePaymentMethodsConfig(defaultPaymentMethods);
      setPaymentMethods(defaultPaymentMethods);
    }
  };

  const savePaymentMethodsConfig = async (methods: PaymentMethod[]) => {
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .eq("key", "payment_methods");

    if (error) {
      console.error("Error checking payment methods config:", error);
      return;
    }

    if (data && data.length > 0) {
      // Update existing config
      const { error: updateError } = await supabase
        .from("site_config")
        .update({ value: JSON.stringify(methods) })
        .eq("key", "payment_methods");

      if (updateError) {
        console.error("Error updating payment methods config:", updateError);
        toast({
          title: "Error",
          description: "Failed to update payment methods",
          variant: "destructive",
        });
      }
    } else {
      // Insert new config
      const { error: insertError } = await supabase
        .from("site_config")
        .insert({
          key: "payment_methods",
          value: JSON.stringify(methods),
          type: "json",
          description: "Payment methods configuration",
        });

      if (insertError) {
        console.error("Error inserting payment methods config:", insertError);
        toast({
          title: "Error",
          description: "Failed to save payment methods",
          variant: "destructive",
        });
      }
    }
  };

  const togglePaymentMethod = async (id: string, active: boolean) => {
    const updatedMethods = paymentMethods.map(method =>
      method.id === id ? { ...method, active } : method
    );
    
    await savePaymentMethodsConfig(updatedMethods);
    setPaymentMethods(updatedMethods);
    
    toast({
      title: active ? "Payment method enabled" : "Payment method disabled",
      description: `The payment method has been ${active ? "enabled" : "disabled"}.`,
    });
  };

  const handleEdit = (method: PaymentMethod) => {
    setIsEditing(method.id);
    setEditingMethod({ ...method });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditingMethod(null);
  };

  const handleSave = async () => {
    if (!editingMethod) return;

    const updatedMethods = paymentMethods.map(method =>
      method.id === editingMethod.id ? editingMethod : method
    );

    await savePaymentMethodsConfig(updatedMethods);
    setPaymentMethods(updatedMethods);
    setIsEditing(null);
    setEditingMethod(null);

    toast({
      title: "Settings updated",
      description: `${editingMethod.name} settings have been updated.`,
    });
  };

  const handleChangeSetupData = (key: string, value: any) => {
    if (!editingMethod) return;
    
    setEditingMethod({
      ...editingMethod,
      setup_data: {
        ...editingMethod.setup_data,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentMethods.map(method => (
            <div key={method.id} className="border rounded-lg p-4">
              {isEditing === method.id ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{method.name} Settings</h3>
                  
                  <div>
                    <Label htmlFor={`${method.id}-active`}>Active</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Switch
                        id={`${method.id}-active`}
                        checked={editingMethod?.active || false}
                        onCheckedChange={(checked) => {
                          if (editingMethod) {
                            setEditingMethod({ ...editingMethod, active: checked });
                          }
                        }}
                      />
                      <span>{editingMethod?.active ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>

                  {method.requires_setup && editingMethod && (
                    <div className="space-y-4 mt-4">
                      {method.id === "paypal" && (
                        <>
                          <div>
                            <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
                            <Input
                              id="paypal-client-id"
                              value={editingMethod.setup_data.client_id || ""}
                              onChange={(e) => handleChangeSetupData("client_id", e.target.value)}
                              placeholder="Enter your PayPal Client ID"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="paypal-sandbox">Sandbox Mode</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Switch
                                id="paypal-sandbox"
                                checked={editingMethod.setup_data.sandbox_mode || false}
                                onCheckedChange={(checked) => handleChangeSetupData("sandbox_mode", checked)}
                              />
                              <span>{editingMethod.setup_data.sandbox_mode ? "Enabled" : "Disabled"}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Enable for testing. Disable for accepting real payments.
                            </p>
                          </div>
                        </>
                      )}

                      {method.id === "stripe" && (
                        <>
                          <div>
                            <Label htmlFor="stripe-publishable-key">Publishable Key</Label>
                            <Input
                              id="stripe-publishable-key"
                              value={editingMethod.setup_data.publishable_key || ""}
                              onChange={(e) => handleChangeSetupData("publishable_key", e.target.value)}
                              placeholder="Enter your Stripe Publishable Key"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="stripe-secret-key">Secret Key</Label>
                            <Input
                              id="stripe-secret-key"
                              value={editingMethod.setup_data.secret_key || ""}
                              onChange={(e) => handleChangeSetupData("secret_key", e.target.value)}
                              placeholder="Enter your Stripe Secret Key"
                              className="mt-1"
                              type="password"
                            />
                          </div>
                          <div>
                            <Label htmlFor="stripe-test-mode">Test Mode</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Switch
                                id="stripe-test-mode"
                                checked={editingMethod.setup_data.test_mode || false}
                                onCheckedChange={(checked) => handleChangeSetupData("test_mode", checked)}
                              />
                              <span>{editingMethod.setup_data.test_mode ? "Enabled" : "Disabled"}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2 mt-4">
                    <Button onClick={handleSave}>Save Settings</Button>
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={method.active}
                      onCheckedChange={(checked) => togglePaymentMethod(method.id, checked)}
                      aria-label={`${method.name} active`}
                    />
                    {method.requires_setup && (
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(method)}>
                        <Settings2 className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {paymentMethods.length === 0 && (
            <div className="text-center p-4">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <h3 className="font-medium">No payment methods configured</h3>
              <p className="text-sm text-gray-500">
                There are no payment methods available. Please check your configuration.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodsSettings;
