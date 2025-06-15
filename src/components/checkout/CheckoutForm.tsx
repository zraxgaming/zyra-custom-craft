import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import { Loader2, CreditCard, Truck, MapPin, Check } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().min(3, "Zip code is required"),
  country: z.string().min(2, "Country is required"),
  deliveryMethod: z.enum(["delivery", "pickup"]),
  paymentMethod: z.enum(["card", "cash"]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  subtotal: number;
  items: any[];
  onPaymentSuccess: (orderId: string) => void;
  deliveryOptions: { label: string; value: string }[];
  paymentMethods: { label: string; value: string }[];
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  subtotal,
  items,
  onPaymentSuccess,
  deliveryOptions,
  paymentMethods,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: user?.user_metadata?.phone || "",
      address: user?.user_metadata?.address || "",
      city: user?.user_metadata?.city || "",
      state: user?.user_metadata?.state || "",
      zipCode: user?.user_metadata?.zip_code || "",
      country: user?.user_metadata?.country || "",
      deliveryMethod: "delivery",
      paymentMethod: "card",
    },
  });

  const deliveryMethod = watch("deliveryMethod");
  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Create order in database
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id,
          total_amount: subtotal,
          status: paymentMethod === "cash" ? "pending" : "processing",
          shipping_address: `${data.address}, ${data.city}, ${data.state || ""} ${data.zipCode}, ${data.country}`,
          shipping_method: data.deliveryMethod,
          payment_method: data.paymentMethod,
          customer_name: data.fullName,
          customer_email: data.email,
          customer_phone: data.phone,
          items: items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            customization: item.customization || {},
          })),
        })
        .select()
        .single();

      if (error) throw error;

      // Process payment (simplified for demo)
      if (paymentMethod === "card") {
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Clear cart after successful order
      await clearCart();

      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.substring(0, 8)} has been placed.`,
      });

      onPaymentSuccess(order.id);
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error.message || "An error occurred during checkout",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      {/* Left: Shipping & Billing */}
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city")}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input id="state" {...register("state")} />
            </div>

            <div>
              <Label htmlFor="zipCode">Zip/Postal Code</Label>
              <Input
                id="zipCode"
                {...register("zipCode")}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register("country")}
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Delivery Method
          </h2>
          <RadioGroup
            defaultValue={deliveryMethod}
            {...register("deliveryMethod")}
            className="grid grid-cols-2 gap-4 pt-2"
          >
            {deliveryOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-all ${
                  deliveryMethod === option.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`delivery-${option.value}`}
                />
                <Label
                  htmlFor={`delivery-${option.value}`}
                  className="flex-1 cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Method
          </h2>
          <RadioGroup
            defaultValue={paymentMethod}
            {...register("paymentMethod")}
            className="grid grid-cols-2 gap-4 pt-2"
          >
            {paymentMethods.map((method) => (
              <div
                key={method.value}
                className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === method.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem
                  value={method.value}
                  id={`payment-${method.value}`}
                />
                <Label
                  htmlFor={`payment-${method.value}`}
                  className="flex-1 cursor-pointer"
                >
                  {method.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {paymentMethod === "card" && (
            <div className="mt-4 space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  {...register("cardNumber")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    {...register("cardExpiry")}
                  />
                </div>
                <div>
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    placeholder="123"
                    {...register("cardCvc")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col gap-4 sticky top-6">
        <h2 className="text-xl font-bold mb-2">Order Summary</h2>
        
        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                {item.customization && Object.keys(item.customization).length > 0 && (
                  <div className="mt-1">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      Customized
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{deliveryMethod === "pickup" ? "Free" : "$5.00"}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${(subtotal * 0.05).toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>
              ${(
                subtotal +
                (deliveryMethod === "pickup" ? 0 : 5) +
                subtotal * 0.05
              ).toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete Order
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
