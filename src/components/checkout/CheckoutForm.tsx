import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCart } from '@/components/cart/CartProvider';
import { useAuth, AuthContextType, Profile as AuthProfile } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingBag, CreditCard, Truck, UserCircle, Gift, Smartphone } from 'lucide-react';
import OrderSummary from './OrderSummary';
import CouponForm from './CouponForm';
import GiftCardForm from './GiftCardForm';
import DeliveryOptions, { DeliveryOption as DeliveryOptionType } from './DeliveryOptions';
import ZiinaPayment from './ZiinaPayment';
import { CartItem } from '@/types/cart';

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface CheckoutFormProps {
  onPaymentSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onPaymentSuccess }) => {
  const { 
    items, 
    clearCart, 
    totalPrice, 
    subtotal, 
    applyCoupon, 
    appliedCoupon, 
    removeCoupon, 
    applyGiftCard, 
    appliedGiftCard,
    removeGiftCard,
    giftCardAmount,
    discount, 
  } = useCart();
  const { user, profile } = useAuth() as AuthContextType & { profile: AuthProfile | null };
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ziina' | 'cod'>('ziina');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOptionType | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { control, handleSubmit, setValue, getValues, formState: { errors }, trigger } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      country: 'UAE',
    },
  });

  useEffect(() => {
    if (user && profile) {
      setValue('firstName', profile.first_name || '');
      setValue('lastName', profile.last_name || '');
      setValue('email', user.email || '');
      setValue('phone', profile.phone || '');
    } else if (user) {
      setValue('email', user.email || '');
    }
  }, [user, profile, setValue]);

  const orderTotalAfterDiscounts = totalPrice - giftCardAmount;
  const finalAmountWithDelivery = orderTotalAfterDiscounts + (selectedDelivery?.price || 0);

  const handleSuccessfulOrderPlacement = async (orderId: string, paymentConfirmed: boolean = true) => {
    toast({
      title: paymentConfirmed ? "Order Placed!" : "Order Submitted!",
      description: paymentConfirmed 
        ? `Your order #${orderId} has been placed successfully.`
        : `Your order #${orderId} is submitted. Payment pending.`,
    });
    await clearCart(); 
    onPaymentSuccess(orderId); 
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    setIsLoading(false);
    setIsProcessingPayment(false);
  };
  
  const createOrderForPaymentGateway = async (formData: AddressFormData, currentPaymentMethod: 'ziina' | 'cod') => {
    if (!selectedDelivery) {
      toast({ title: "Error", description: "Please select a delivery option.", variant: "destructive" });
      throw new Error("Delivery option not selected");
    }

    const orderPayload = {
      user_id: user?.id,
      profile_id: profile?.id, 
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization,
        name: item.name,
        image_url: item.image_url
      })),
      total_amount: finalAmountWithDelivery,
      shipping_address: formData,
      billing_address: formData, 
      status: currentPaymentMethod === 'cod' ? 'pending' : 'pending_payment', 
      currency: 'AED',
      payment_method: currentPaymentMethod,
      payment_status: 'pending',
      delivery_type: selectedDelivery.name,
      notes: `Coupon: ${appliedCoupon?.code || 'None'}. Gift Card: ${appliedGiftCard?.code || 'None'}. Delivery: ${selectedDelivery.name} (+${selectedDelivery.price} AED).`,
      coupon_id: appliedCoupon?.id,
      gift_card_id: appliedGiftCard?.id,
      shipping_cost: selectedDelivery.price,
    };

    const { data: orderResult, error } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (error) {
      console.error("Error creating preliminary order:", error);
      throw error;
    }
    return orderResult.id;
  };

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    if (!selectedDelivery) {
      toast({ title: "Error", description: "Please select a delivery option.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (paymentMethod === 'cod' || finalAmountWithDelivery === 0) {
      try {
        const orderId = await createOrderForPaymentGateway(data, 'cod');
         await supabase.from('orders').update({ status: 'processing', payment_status: 'pending_cod' }).eq('id', orderId);
        await handleSuccessfulOrderPlacement(orderId, false);
      } catch (error: any) {
        console.error("Error placing COD order:", error);
        toast({
          title: "Order Placement Failed",
          description: error.message || "Could not place your order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (paymentMethod === 'ziina') {
      toast({ title: "Proceeding to Ziina", description: "Please complete your shipping details and click 'Pay with Ziina'."});
      setIsLoading(false); 
    }
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button onClick={() => onPaymentSuccess('')}>Continue Shopping</Button> {/* Or navigate('/shop') directly */}
      </div>
    );
  }

  const handleZiinaPaymentInitiation = async () => {
    const formData = getValues();
    if (!selectedDelivery) {
      toast({ title: "Error", description: "Please select a delivery option before paying.", variant: "destructive" });
      return;
    }
    
    const isValid = await trigger();
    if (!isValid) {
        toast({ title: "Form Invalid", description: "Please fill in all required shipping details.", variant: "destructive" });
        return;
    }

    setIsProcessingPayment(true);
    try {
      const orderId = await createOrderForPaymentGateway(formData, 'ziina');
      const amountInFils = Math.round(finalAmountWithDelivery * 100);

      console.log("Attempting to invoke Ziina payment function for order:", orderId);
      const paymentIntentData: any = { error: "Ziina Edge Function to be removed." }; 
      const paymentIntentError: any = true;

      if (paymentIntentError) {
        console.error("Ziina payment intent error (function to be removed):", paymentIntentData?.error || "Unknown error");
        throw new Error(paymentIntentData?.error || 'Failed to initiate Ziina payment (function pending removal).');
      }

      if (paymentIntentData.payment_url) {
        if (paymentIntentData.payment_id) {
            await supabase
            .from('orders')
            .update({ 
                notes: `Coupon: ${appliedCoupon?.code || 'None'}. Gift Card: ${appliedGiftCard?.code || 'None'}. Delivery: ${selectedDelivery.name}. Ziina Payment ID: ${paymentIntentData.payment_id}`
            })
            .eq('id', orderId);
        }
        window.location.href = paymentIntentData.payment_url;
      } else {
        throw new Error(paymentIntentData.error || 'Failed to get Ziina payment URL (function pending removal).');
      }
    } catch (error: any) {
      console.error('Ziina payment initiation error:', error);
      handlePaymentError(error.message || 'Could not initiate Ziina payment.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Accordion type="single" collapsible defaultValue="shipping" className="w-full">
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-6 w-6 text-primary" />
                  Shipping Information
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Card>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    {(Object.keys(addressSchema.shape) as Array<keyof AddressFormData>).map((key) => (
                      <div key={key} className={key === 'address' || key === 'country' ? 'md:col-span-2' : ''}>
                        <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                        <Controller
                          name={key}
                          control={control}
                          render={({ field }) => (
                            <Input id={key} {...field} placeholder={`Enter your ${key.toLowerCase()}`} />
                          )}
                        />
                        {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]?.message}</p>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <Truck className="h-6 w-6 text-primary" />
                  Delivery Options
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <DeliveryOptions 
                  selectedOption={selectedDelivery} 
                  onSelectOption={setSelectedDelivery} // Corrected prop name to onSelectOption
                />
                {!selectedDelivery && (errors as any)?.delivery && <p className="text-red-500 text-sm mt-1">Please select a delivery option.</p>}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Payment Method
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex gap-4">
                      <Button variant={paymentMethod === 'ziina' ? 'default' : 'outline'} onClick={() => setPaymentMethod('ziina')} className="flex-1">
                        <Smartphone className="mr-2 h-4 w-4"/> Ziina
                      </Button>
                      <Button variant={paymentMethod === 'cod' ? 'default' : 'outline'} onClick={() => setPaymentMethod('cod')} className="flex-1">Cash on Delivery</Button>
                    </div>
                    
                    {paymentMethod === 'ziina' && finalAmountWithDelivery > 0 && (
                      <ZiinaPayment
                        amount={finalAmountWithDelivery}
                        onInitiatePayment={handleZiinaPaymentInitiation}
                        isProcessing={isProcessingPayment}
                      />
                    )}
                    {paymentMethod === 'cod' && (
                      <p className="text-sm text-muted-foreground">You will pay upon delivery.</p>
                    )}
                     {finalAmountWithDelivery === 0 && <p className="text-sm text-green-600">Your order total is 0 AED. No payment required.</p>}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="promo">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center gap-2">
                  <Gift className="h-6 w-6 text-primary" />
                  Promotions & Gift Cards
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <CouponForm 
                  onCouponApply={applyCoupon}
                  onCouponRemove={removeCoupon}
                  orderTotal={subtotal}
                  appliedCoupon={appliedCoupon}
                />
                <GiftCardForm 
                  onGiftCardApply={applyGiftCard}
                  onGiftCardRemove={removeGiftCard}
                  orderTotal={totalPrice}
                  appliedGiftCard={appliedGiftCard}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <OrderSummary items={items} deliveryCost={selectedDelivery?.price || 0} />
          <Button 
            type="submit" 
            className="w-full py-3 text-lg" 
            disabled={isLoading || (paymentMethod === 'ziina' && finalAmountWithDelivery > 0 && !isProcessingPayment)} 
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ShoppingBag className="mr-2 h-5 w-5" />
            )}
            {paymentMethod === 'cod' || finalAmountWithDelivery === 0 ? 'Place Order' : `Proceed with Order`}
          </Button>
          {paymentMethod === 'ziina' && finalAmountWithDelivery > 0 && !isLoading && (
             <p className="text-center text-sm text-muted-foreground">
                After filling details, click "Pay with Ziina" in the payment section above.
             </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
