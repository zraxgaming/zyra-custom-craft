
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ZiinaPayment from "@/components/payment/ZiinaPayment";
import { Check, CreditCard, MapPin, Home, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutFormProps {
  items: any[];
  subtotal: number;
  onPaymentSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  items,
  subtotal,
  onPaymentSuccess,
}) => {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [giftCardDiscount, setGiftCardDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCode, setValidatingCode] = useState(false);

  // Calculate shipping cost and total
  const shippingCost = deliveryOption === "delivery" ? 30 : 0;
  const total = subtotal + shippingCost - giftCardDiscount - couponDiscount;

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setUserProfile(data);
        setValue("firstName", data.first_name);
        setValue("lastName", data.last_name);
        setValue("email", data.email || user?.email);
        setValue("phone", data.phone);
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
    }
  };

  const onSubmit = async (data: any) => {
    if (total <= 0) {
      // Handle free order
      setLoading(true);
      try {
        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user?.id,
            total_amount: 0,
            status: 'processing',
            payment_status: 'paid',
            payment_method: 'gift_card',
            currency: 'USD',
            shipping_address: {
              firstName: data.firstName,
              lastName: data.lastName,
              address: data.address,
              city: data.city,
              postalCode: data.postalCode,
              country: data.country,
              email: data.email,
              phone: data.phone,
            },
            delivery_type: deliveryOption,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Insert order items
        if (items.length > 0) {
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(
              items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
                customization: item.customization
              }))
            );

          if (itemsError) throw itemsError;
        }

        // Update gift card balance if used
        if (appliedGiftCard) {
          const { error: giftCardError } = await supabase
            .from('gift_cards')
            .update({ 
              amount: Math.max(0, appliedGiftCard.amount - giftCardDiscount),
              updated_at: new Date().toISOString()
            })
            .eq('id', appliedGiftCard.id);

          if (giftCardError) throw giftCardError;
        }

        // Update coupon usage if used
        if (appliedCoupon) {
          const { error: couponError } = await supabase
            .from('coupons')
            .update({ 
              used_count: appliedCoupon.used_count + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', appliedCoupon.id);

          if (couponError) throw couponError;
        }

        toast({
          title: "Order Placed!",
          description: "Your order has been placed successfully.",
        });

        onPaymentSuccess(order.id);
      } catch (error: any) {
        console.error('Error placing order:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to place order",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // For orders requiring payment, pass the data to the payment component
    // The orderData will be used in ZiinaPayment component
  };

  const applyGiftCard = async () => {
    if (!giftCardCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a gift card code",
        variant: "destructive",
      });
      return;
    }

    setValidatingCode(true);
    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', giftCardCode.trim())
        .eq('is_active', true)
        .gt('amount', 0)
        .single();

      if (error) throw error;

      if (data) {
        const currentDate = new Date();
        if (data.expires_at && new Date(data.expires_at) < currentDate) {
          toast({
            title: "Expired Gift Card",
            description: "This gift card has expired",
            variant: "destructive",
          });
          return;
        }

        // Calculate the discount (up to the total amount)
        const discount = Math.min(data.amount, total - couponDiscount);
        
        setGiftCardDiscount(discount);
        setAppliedGiftCard(data);
        
        toast({
          title: "Gift Card Applied",
          description: `$${discount.toFixed(2)} discount applied`,
        });
      } else {
        toast({
          title: "Invalid Gift Card",
          description: "Gift card not found or has no balance",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error applying gift card:', error);
      toast({
        title: "Error",
        description: "Invalid gift card code",
        variant: "destructive",
      });
    } finally {
      setValidatingCode(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setValidatingCode(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim())
        .eq('active', true)
        .single();

      if (error) throw error;

      if (data) {
        const currentDate = new Date();
        if (data.expires_at && new Date(data.expires_at) < currentDate) {
          toast({
            title: "Expired Coupon",
            description: "This coupon has expired",
            variant: "destructive",
          });
          return;
        }

        if (data.starts_at && new Date(data.starts_at) > currentDate) {
          toast({
            title: "Coupon Not Active Yet",
            description: "This coupon is not active yet",
            variant: "destructive",
          });
          return;
        }

        if (data.max_uses && data.used_count >= data.max_uses) {
          toast({
            title: "Coupon Fully Used",
            description: "This coupon has reached its usage limit",
            variant: "destructive",
          });
          return;
        }

        if (data.min_purchase && subtotal < data.min_purchase) {
          toast({
            title: "Minimum Purchase Required",
            description: `This coupon requires a minimum purchase of $${data.min_purchase}`,
            variant: "destructive",
          });
          return;
        }

        // Calculate discount based on type
        let discount = 0;
        if (data.discount_type === 'percentage') {
          discount = (subtotal * data.discount_value) / 100;
        } else {
          discount = Math.min(data.discount_value, subtotal);
        }

        setCouponDiscount(discount);
        setAppliedCoupon(data);
        
        toast({
          title: "Coupon Applied",
          description: `$${discount.toFixed(2)} discount applied`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: "Coupon not found or expired",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error",
        description: "Invalid coupon code",
        variant: "destructive",
      });
    } finally {
      setValidatingCode(false);
    }
  };

  const removeGiftCard = () => {
    setGiftCardDiscount(0);
    setAppliedGiftCard(null);
    setGiftCardCode("");
  };

  const removeCoupon = () => {
    setCouponDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName", { required: "First name is required" })}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName", { required: "Last name is required" })}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.lastName.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone.message as string}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...register("address", { required: "Address is required" })}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.address.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("city", { required: "City is required" })}
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.city.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  {...register("postalCode", { required: "Postal code is required" })}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.postalCode.message as string}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="country">Country</Label>
                <Controller
                  name="country"
                  control={control}
                  defaultValue="United Arab Emirates"
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <select
                      id="country"
                      className="w-full p-2 border rounded-md bg-background"
                      {...field}
                    >
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Bahrain">Bahrain</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Oman">Oman</option>
                    </select>
                  )}
                />
                {errors.country && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.country.message as string}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Delivery Options
            </h2>
            <div className="space-y-3">
              <div
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  deliveryOption === "delivery"
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setDeliveryOption("delivery")}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    deliveryOption === "delivery" ? "border-primary" : ""
                  }`}>
                    {deliveryOption === "delivery" && (
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Standard Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Delivery within 3-5 business days
                    </p>
                  </div>
                </div>
                <p className="font-medium">$30.00</p>
              </div>

              <div
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  deliveryOption === "pickup"
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setDeliveryOption("pickup")}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    deliveryOption === "pickup" ? "border-primary" : ""
                  }`}>
                    {deliveryOption === "pickup" && (
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Store Pickup</p>
                    <p className="text-sm text-muted-foreground">
                      Pick up at our store location
                    </p>
                  </div>
                </div>
                <p className="font-medium">Free</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex">
                    <span>{item.quantity} x</span>
                    <span className="ml-2 font-medium truncate max-w-[200px]">
                      {item.name}
                    </span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              {giftCardDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center">
                    Gift Card
                    <button
                      type="button"
                      className="ml-1 text-muted-foreground hover:text-red-500"
                      onClick={removeGiftCard}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                  <span>-${giftCardDiscount.toFixed(2)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center">
                    Coupon
                    <button
                      type="button"
                      className="ml-1 text-muted-foreground hover:text-red-500"
                      onClick={removeCoupon}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {!appliedGiftCard && (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Gift Card Code"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value)}
                    disabled={validatingCode}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={applyGiftCard}
                    disabled={validatingCode}
                  >
                    Apply
                  </Button>
                </div>
              )}

              {!appliedCoupon && (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={validatingCode}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={applyCoupon}
                    disabled={validatingCode}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment
            </h2>
            
            {total <= 0 ? (
              <Button 
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Complete Order (Fully Paid)
                  </>
                )}
              </Button>
            ) : (
              <ZiinaPayment
                amount={total}
                onSuccess={onPaymentSuccess}
                onError={(error) => {
                  toast({
                    title: "Payment Failed",
                    description: error,
                    variant: "destructive",
                  });
                }}
                orderData={{
                  user_id: user?.id,
                  items: items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    customization: item.customization
                  })),
                  shipping_address: {
                    firstName: document.getElementById("firstName")?.value,
                    lastName: document.getElementById("lastName")?.value,
                    address: document.getElementById("address")?.value,
                    city: document.getElementById("city")?.value,
                    postalCode: document.getElementById("postalCode")?.value,
                    country: document.getElementById("country")?.value,
                  },
                  email: document.getElementById("email")?.value,
                  phone: document.getElementById("phone")?.value,
                  delivery_type: deliveryOption,
                  gift_card_id: appliedGiftCard?.id,
                  coupon_id: appliedCoupon?.id
                }}
              />
            )}
          </Card>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
