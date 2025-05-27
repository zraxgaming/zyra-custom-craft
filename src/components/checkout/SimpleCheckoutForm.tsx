import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Smartphone, Shield, Loader2 } from "lucide-react";
import PayPalPayment from "./PayPalPayment";

interface SimpleCheckoutFormProps {
  items: any[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const SimpleCheckoutForm: React.FC<SimpleCheckoutFormProps> = ({
  items,
  subtotal,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ziina");
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "UAE"
  });

  // Always keep email in sync with user.email
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, email: user?.email || "" }));
  }, [user?.email]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const processPayment = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: subtotal,
          status: 'pending',
          payment_status: 'pending',
          payment_method: paymentMethod,
          shipping_address: formData,
          billing_address: formData
        })
        .select()
        .single();
      if (orderError) throw orderError;
      // Add order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      await supabase.from('order_items').insert(orderItems);
      if (paymentMethod === 'ziina') {
        // Process real Ziina payment
        const orderData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          items,
          subtotal
        };
        const { data, error } = await supabase.functions.invoke('ziina-payment', {
          body: {
            amount: Math.round(subtotal * 367),
            success_url: `${window.location.origin}/order-success/${order.id}`,
            cancel_url: `${window.location.origin}/checkout`,
            order_data: orderData
          }
        });
        if (error) throw error;
        if (data?.payment_url) {
          localStorage.setItem('pending_order_id', order.id);
          window.location.href = data.payment_url;
        } else {
          throw new Error('No payment URL received');
        }
      } else if (paymentMethod === 'paypal') {
        // PayPal handled in UI, just update order status on success
        setShowPayPal(true);
        setCurrentOrderId(order.id);
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Unable to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // State for PayPal modal
  const [showPayPal, setShowPayPal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  
  const handlePayPalSuccess = async (transactionId: string) => {
    if (!currentOrderId) return;
    await supabase.from('orders').update({
      status: 'processing',
      payment_status: 'paid',
      tracking_number: transactionId
    }).eq('id', currentOrderId);
    setShowPayPal(false);
    onPaymentSuccess(currentOrderId);
  };
  
  const handlePayPalError = (error: string) => {
    toast({
      title: "PayPal Payment Failed",
      description: error,
      variant: "destructive"
    });
    setShowPayPal(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Shield className="h-5 w-5" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              readOnly
              className="border-purple-200 focus:border-purple-500 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+971 50 123 4567"
              className="border-purple-200 focus:border-purple-500"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="border-purple-200 focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 animate-slide-in-up">
        <CardHeader>
          <CardTitle className="text-purple-700 dark:text-purple-300">Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50 dark:bg-purple-950 hover:shadow-md transition-all duration-300">
              <RadioGroupItem value="ziina" id="ziina" />
              <Label htmlFor="ziina" className="flex items-center gap-2 cursor-pointer flex-1">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <span className="text-purple-700 dark:text-purple-300">Ziina Payment (AED)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950 hover:shadow-md transition-all duration-300">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 dark:text-blue-300">PayPal (USD)</span>
              </Label>
            </div>
          </RadioGroup>
          {paymentMethod === 'ziina' && (
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+971 50 123 4567"
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          )}
          {paymentMethod === 'ziina' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💰 Amount: {(subtotal * 3.67).toFixed(2)} AED (${subtotal.toFixed(2)} USD)
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                🔒 Secure payment via Ziina Payment Gateway
              </p>
            </div>
          )}
          {paymentMethod === 'paypal' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💰 Amount: ${subtotal.toFixed(2)} USD
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                🔒 Secure payment via PayPal
              </p>
            </div>
          )}
          <Button 
            onClick={processPayment} 
            disabled={isProcessing || (paymentMethod === 'ziina' && !formData.phone)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                {paymentMethod === 'ziina'
                  ? `Pay ${(subtotal * 3.67).toFixed(2)} AED with Ziina`
                  : `Pay $${subtotal.toFixed(2)} with PayPal`}
              </>
            )}
          </Button>
          {showPayPal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 max-w-lg w-full relative flex flex-col items-center">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
                  onClick={() => setShowPayPal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">Complete Your PayPal Payment</h2>
                <PayPalPayment
                  amount={subtotal}
                  orderData={formData}
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                  clientId="demo-client-id"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleCheckoutForm;
