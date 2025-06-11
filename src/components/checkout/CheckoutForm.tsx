
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Truck, MapPin, CreditCard, Banknote, Loader2 } from 'lucide-react';
import ZiinaPayment from './ZiinaPayment';
import OrderSummary from './OrderSummary';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutFormProps {
  cartItems: any[];
  subtotal: number;
  onOrderComplete: (orderId: string) => void;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems, subtotal, onOrderComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('ziina');
  const [shippingCost, setShippingCost] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UAE'
  });

  useEffect(() => {
    // Show fake loading for 1 second
    setLoading(true);
    setTimeout(() => {
      fetchShippingMethods();
      setLoading(false);
    }, 1000);
  }, []);

  const fetchShippingMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('active', true)
        .order('price', { ascending: true });

      if (error) throw error;

      const methods = data || [];
      // Add default Store Pickup option
      const defaultMethods = [
        {
          id: 'store-pickup',
          name: 'Store Pickup',
          description: 'Pick up from our store in International City, Dubai',
          price: 0,
          estimated_days: '1-2'
        },
        ...methods
      ];

      setShippingMethods(defaultMethods);
      if (defaultMethods.length > 0) {
        setSelectedShipping(defaultMethods[0].id);
        setShippingCost(defaultMethods[0].price);
      }
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      // Fallback to default methods
      const fallbackMethods = [
        {
          id: 'store-pickup',
          name: 'Store Pickup',
          description: 'Pick up from our store in International City, Dubai',
          price: 0,
          estimated_days: '1-2'
        }
      ];
      setShippingMethods(fallbackMethods);
      setSelectedShipping('store-pickup');
      setShippingCost(0);
    }
  };

  const handleShippingChange = (methodId: string) => {
    setSelectedShipping(methodId);
    const method = shippingMethods.find(m => m.id === methodId);
    setShippingCost(method?.price || 0);
  };

  const handleOrderSuccess = async (transactionId: string) => {
    try {
      const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: user?.id,
          total_amount: subtotal + shippingCost,
          status: 'pending',
          payment_method: paymentMethod,
          payment_status: 'completed',
          delivery_type: selectedShipping,
          shipping_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          },
          billing_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
          }
        });

      if (error) throw error;

      // Add order items
      for (const item of cartItems) {
        await supabase
          .from('order_items')
          .insert({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            customization: item.customization
          });
      }

      onOrderComplete(orderId);
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.message || 'Failed to create order');
    }
  };

  const handleCashOnPickupOrder = async () => {
    if (selectedShipping !== 'store-pickup') {
      toast({
        title: "Invalid Payment Method",
        description: "Cash on pickup is only available for store pickup orders",
        variant: "destructive"
      });
      return;
    }

    try {
      await handleOrderSuccess('CASH_ON_PICKUP');
      toast({
        title: "Order Placed Successfully! 🎉",
        description: "Your order has been placed. Please visit our store to complete payment.",
      });
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in-elegant">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="focus-professional"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="focus-professional"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="focus-professional"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="focus-professional"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="focus-professional"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="focus-professional"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="focus-professional"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="focus-professional"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedShipping} onValueChange={handleShippingChange}>
                {shippingMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover-lift-subtle">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          <p className="text-sm text-muted-foreground">Estimated: {method.estimated_days} days</p>
                        </div>
                        <span className="font-semibold">
                          {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover-lift-subtle">
                  <RadioGroupItem value="ziina" id="ziina" />
                  <Label htmlFor="ziina" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Pay with Ziina</span>
                    </div>
                  </Label>
                </div>
                
                {selectedShipping === 'store-pickup' && (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover-lift-subtle">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        <span>Cash on Pickup</span>
                      </div>
                    </Label>
                  </div>
                )}
              </RadioGroup>

              {paymentMethod === 'ziina' && (
                <div className="mt-4">
                  <ZiinaPayment
                    amount={subtotal + shippingCost}
                    onSuccess={handleOrderSuccess}
                    onError={(error) => {
                      toast({
                        title: "Payment Failed",
                        description: error,
                        variant: "destructive"
                      });
                    }}
                    orderData={{ firstName: formData.firstName }}
                  />
                </div>
              )}

              {paymentMethod === 'cash' && selectedShipping === 'store-pickup' && (
                <div className="mt-4">
                  <Card className="border border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-700 mb-2">Cash on Pickup</h4>
                      <p className="text-sm text-green-600 mb-4">
                        You will pay ${(subtotal + shippingCost).toFixed(2)} when you pick up your order from our store.
                      </p>
                      <Button 
                        onClick={handleCashOnPickupOrder}
                        className="w-full bg-green-600 hover:bg-green-700 btn-professional"
                      >
                        <Banknote className="h-4 w-4 mr-2" />
                        Place Order (Cash on Pickup)
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={subtotal + shippingCost}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
