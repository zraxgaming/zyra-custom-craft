import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types/cart';
import ZiinaPayment from './ZiinaPayment';
import OrderSummary from './OrderSummary';
import { CreditCard, Banknote, Package } from 'lucide-react';

interface CheckoutFormProps {
  items: CartItem[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ items, subtotal, onPaymentSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('ziina');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);

  const shippingCost = deliveryMethod === 'pickup' ? 0 : 
    shippingMethods.find(method => method.id === deliveryMethod)?.price || 0;
  const total = subtotal + shippingCost;

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('active', true)
        .order('price');

      if (error) throw error;
      setShippingMethods(data || []);
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
    }
  };

  const createOrder = async (paymentData: any) => {
    try {
      const orderData = {
        user_id: user?.id,
        total_amount: total,
        status: 'pending',
        payment_method: paymentMethod,
        payment_status: 'completed',
        delivery_type: deliveryMethod,
        currency: 'USD'
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      const orderId = await createOrder({ transactionId });
      onPaymentSuccess(orderId);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Delivery Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="flex-1">
                  <div>
                    <p className="font-medium">Store Pickup</p>
                    <p className="text-sm text-muted-foreground">Free - Pick up from our store</p>
                  </div>
                </Label>
                <span className="font-medium">Free</span>
              </div>
              
              {shippingMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1">
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      {method.estimated_days && (
                        <p className="text-sm text-muted-foreground">Estimated: {method.estimated_days}</p>
                      )}
                    </div>
                  </Label>
                  <span className="font-medium">${method.price}</span>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="ziina" id="ziina" />
                <Label htmlFor="ziina" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  Pay with Ziina
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-green-600" />
                  Cash on Pickup
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {paymentMethod === 'ziina' && (
          <ZiinaPayment
            amount={total}
            onSuccess={handlePaymentSuccess}
            onError={(error) => {
              toast({
                title: "Payment Failed",
                description: error,
                variant: "destructive"
              });
            }}
          />
        )}

        {paymentMethod === 'cash' && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Banknote className="h-12 w-12 mx-auto text-green-600" />
                <h3 className="text-lg font-semibold">Cash on Pickup</h3>
                <p className="text-muted-foreground">
                  Pay ${total.toFixed(2)} when you pick up your order from our store.
                </p>
                <Button 
                  onClick={() => handlePaymentSuccess('cash_on_pickup')}
                  className="w-full"
                  disabled={loading}
                >
                  Confirm Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <OrderSummary
        items={items}
        subtotal={subtotal}
        shippingCost={shippingCost}
        total={total}
      />
    </div>
  );
};

export default CheckoutForm;
