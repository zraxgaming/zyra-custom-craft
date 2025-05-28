
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, ShoppingBag } from "lucide-react";

interface CheckoutFormProps {
  items: any[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  items,
  subtotal,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "UAE"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const processPayment = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
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
          payment_method: 'ziina',
          currency: 'AED',
          shipping_address: formData,
          billing_address: formData
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      if (items.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(
            items.map((item: any) => ({
              order_id: order.id,
              product_id: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          );

        if (itemsError) throw itemsError;
      }

      // Get Ziina configuration
      const { data: configData } = await supabase
        .from('site_config')
        .select('*')
        .eq('key', 'ziina_api_key')
        .single();

      if (!configData) {
        throw new Error('Payment system not configured');
      }

      const apiKey = typeof configData.value === 'string' ? configData.value : String(configData.value);

      // Create Ziina payment
      const aedAmount = Math.round(subtotal * 3.67 * 100); // Convert to fils
      
      const ziinaPayload = {
        amount: aedAmount,
        currency_code: 'AED',
        message: `Order #${order.id.slice(-8)} - Zyra Custom Craft`,
        success_url: `${window.location.origin}/order-success/${order.id}`,
        cancel_url: `${window.location.origin}/checkout`,
        failure_url: `${window.location.origin}/checkout`,
        customer_phone: formData.phone
      };

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ziinaPayload)
      });

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.status}`);
      }

      const ziinaData = await response.json();

      // Send order confirmation email
      await fetch('https://hooks.zapier.com/hooks/catch/18195840/2jeyebc/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          type: 'order_confirmation',
          to: formData.email,
          subject: `Thanks for your order, ${formData.firstName}!`,
          name: formData.firstName,
          order_id: `#${order.id.slice(-8)}`,
          items: items.map(item => ({
            name: item.name,
            qty: item.quantity,
            price: `$${(item.price * item.quantity).toFixed(2)}`
          })),
          total: `$${subtotal.toFixed(2)}`,
          message: "We're processing your order and will notify you when it ships."
        })
      });

      // Update order with payment ID
      await supabase
        .from('orders')
        .update({ notes: JSON.stringify({ ziina_payment_id: ziinaData.id }) })
        .eq('id', order.id);

      // Redirect to payment
      const redirectUrl = ziinaData.payment_url || ziinaData.redirect_url || ziinaData.checkout_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        // Simulate success for demo
        setTimeout(() => onPaymentSuccess(order.id), 2000);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || 'Payment processing failed',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
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
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+971 50 123 4567"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={processPayment}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {(subtotal * 3.67).toFixed(2)} AED
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutForm;
