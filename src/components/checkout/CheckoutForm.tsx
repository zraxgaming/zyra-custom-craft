import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/components/cart/CartProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { ReloadIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils";
import { Coupon } from "@/types/coupon";
import { supabase } from "@/integrations/supabase/client";
import { Address } from "@/types/address";
import { PaymentMethod } from "@/types/payment-method";
import { OrderItem } from "@/types/order";

interface CheckoutFormProps {
  subtotal: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ subtotal }) => {
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState<Coupon | string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user?.user_metadata?.name || '');
      setEmail(user?.email || '');
    }
  }, [user]);

  const calculateTotal = () => {
    return subtotal - discount;
  };

  const applyCoupon = async () => {
    setLoadingCoupon(true);
    try {
      const { data: couponData, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode)
        .single();

      if (error) {
        setCoupon(null);
        setDiscount(0);
        toast({
          title: "Invalid coupon",
          description: "Coupon code is not valid.",
          variant: "destructive",
        });
      } else {
        if (couponData && couponData.expiry && new Date(couponData.expiry) < new Date()) {
          setCoupon(null);
          setDiscount(0);
          toast({
            title: "Expired coupon",
            description: "Coupon code has expired.",
            variant: "destructive",
          });
          return;
        }
        setCoupon(couponData);
        setDiscount(couponData.discount);
        toast({
          title: "Coupon applied",
          description: "Coupon code applied successfully.",
        });
      }
    } catch (error: any) {
      setCoupon(null);
      setDiscount(0);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);

    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!name || !email || !address || !city || !state || !zipCode || !country || !phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const orderItems: OrderItem[] = cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      customization: item.customization,
    }));

    const orderData = {
      user_id: user?.id,
      name,
      email,
      address,
      city,
      state,
      zip_code: zipCode,
      country,
      phone,
      subtotal,
      discount,
      total: calculateTotal(),
      items: orderItems,
      coupon_id: typeof coupon === 'object' && coupon !== null ? coupon.id : null,
      payment_method: paymentMethod?.name || 'Credit Card',
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    };

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()

      if (error) {
        console.error('Error creating order:', error);
        toast({
          title: "Error",
          description: "Failed to create order.",
          variant: "destructive",
        });
      } else {
        clearCart();
        toast({
          title: "Order created",
          description: "Your order has been placed successfully.",
        });
        navigate(`/order-success/${data[0].id}`);
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const appliedCoupon = typeof coupon === 'object' && coupon !== null ? coupon : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="123 Main St"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="New York"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="NY"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              placeholder="10001"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="USA"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="555-555-5555"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="payment">
            <AccordionTrigger>Payment Information</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select onValueChange={(value) => setPaymentMethod({ name: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="ziina">Ziina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  We support secure payments via Credit Card and PayPal.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping Address</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Shipping Address</Label>
                  <Input
                    id="shippingAddress"
                    placeholder="123 Shipping St"
                    value={shippingAddress?.address || address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCity">Shipping City</Label>
                  <Input
                    id="shippingCity"
                    placeholder="Shipping City"
                    value={shippingAddress?.city || city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCountry">Shipping Country</Label>
                  <Input
                    id="shippingCountry"
                    placeholder="Shipping Country"
                    value={shippingAddress?.country || country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="billing">
            <AccordionTrigger>Billing Address</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Input
                    id="billingAddress"
                    placeholder="123 Billing St"
                    value={billingAddress?.address || address}
                    onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingCity">Billing City</Label>
                  <Input
                    id="billingCity"
                    placeholder="Billing City"
                    value={billingAddress?.city || city}
                    onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingCountry">Billing Country</Label>
                  <Input
                    id="billingCountry"
                    placeholder="Billing Country"
                    value={billingAddress?.country || country}
                    onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="couponCode">Coupon Code</Label>
            <div className="flex items-center">
              <Input
                id="couponCode"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button
                className="ml-2"
                onClick={applyCoupon}
                disabled={loadingCoupon}
              >
                {loadingCoupon ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
            {appliedCoupon ? (
              <div className="text-sm text-green-500">
                Coupon "{appliedCoupon?.code}" applied. Discount: ${appliedCoupon?.discount}
              </div>
            ) : null}
          </div>
          <div className="text-right space-y-2">
            <div className="text-lg font-semibold">Subtotal: ${subtotal.toFixed(2)}</div>
            {discount > 0 ? (
              <div className="text-lg font-semibold">Discount: -${discount.toFixed(2)}</div>
            ) : null}
            <div className="text-2xl font-bold">Total: ${calculateTotal().toFixed(2)}</div>
          </div>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={handlePayment}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Place Order"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
