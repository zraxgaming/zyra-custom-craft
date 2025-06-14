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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingBag, CreditCard, Truck, UserCircle, Gift, Smartphone } from 'lucide-react';
import OrderSummary from './OrderSummary';
import CouponForm from './CouponForm';
import GiftCardForm from './GiftCardForm';
import DeliveryOptionsComponent from './DeliveryOptions';
import ZiinaPayment from './ZiinaPayment';
import { CartItem } from '@/types/cart';

// Local type definition due to DeliveryOptions.tsx not exporting its internal DeliveryOption type
// This should match the structure of options used by DeliveryOptionsComponent
interface DeliveryOptionType {
  id: string;
  name: string;
  price: number;
  description: string; // Or 'cost' and 'estimated_delivery' depending on actual structure
  cost?: number; // if 'price' is not the cost field
}

// Local type definitions for AuthContext due to read-only file not exporting them
interface LocalAuthProfile {
  id?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  // Add other fields from your actual profile structure if needed
}
interface LocalAuthContextType {
  user: any | null; // Supabase User object
  profile: LocalAuthProfile | null;
  // Add other methods/properties from AuthContext if used, e.g., signIn, signOut
}

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
  const { user, profile } = useAuth() as LocalAuthContextType; // Use local type
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ziina' | 'cod'>('ziina');
  
  // Assuming DeliveryOptions.tsx (read-only) expects/provides string ID for selectedOption and onOptionChange
  // and we have a list of full delivery option objects available.
  // For simplicity, I'll mock one here. In a real app, fetch or define these.
  const MOCK_DELIVERY_OPTIONS: DeliveryOptionType[] = [
    { id: 'standard', name: 'Standard Delivery', price: 15, description: '5-7 days' },
    { id: 'express', name: 'Express Delivery', price: 25, description: '2-3 days' },
  ];
  const [deliveryOptionsList, setDeliveryOptionsList] = useState<DeliveryOptionType[]>(MOCK_DELIVERY_OPTIONS);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const selectedDelivery = deliveryOptionsList.find(opt => opt.id === selectedDeliveryId) || null;
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // This state might be redundant if ZiinaPayment manages its own

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
      setValue('email', user.email || ''); // user.email from Supabase User
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

  const handlePaymentProcessError = (error: string) => { // Renamed to avoid conflict
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    setIsLoading(false); // Ensure main form loader is stopped
    setIsProcessingPayment(false); // Ensure payment specific loader is stopped
  };
  
  const createOrderInDb = async (formData: AddressFormData, currentPaymentMethod: 'ziina' | 'cod', paymentDetails?: any) => {
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
      status: currentPaymentMethod === 'cod' ? 'pending_cod_payment' : (paymentDetails?.status === 'succeeded' ? 'processing' : 'pending_payment'), 
      currency: 'AED',
      payment_method: currentPaymentMethod,
      payment_status: paymentDetails?.status === 'succeeded' ? 'paid' : 'pending',
      delivery_type: selectedDelivery.name,
      notes: `Coupon: ${appliedCoupon?.code || 'None'}. Gift Card: ${appliedGiftCard?.code || 'None'}. Delivery: ${selectedDelivery.name} (+${selectedDelivery.price} AED). ${paymentDetails?.id ? `Ziina Payment ID: ${paymentDetails.id}` : ''}`,
      coupon_id: appliedCoupon?.id,
      gift_card_id: appliedGiftCard?.id,
      shipping_cost: selectedDelivery.price,
      // Add payment_intent_id if available from Ziina
      ...(paymentDetails?.id && { payment_intent_id: paymentDetails.id }),
    };

    console.log("Creating order in DB with payload:", orderPayload);
    const { data: orderResult, error } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (error) {
      console.error("Error creating order in DB:", error);
      throw error;
    }
    console.log("Order created in DB:", orderResult);
    return orderResult.id;
  };

  const onSubmitMainForm = async (data: AddressFormData) => { // Renamed from onSubmit
    setIsLoading(true);
    if (!selectedDelivery) {
      toast({ title: "Error", description: "Please select a delivery option.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (paymentMethod === 'cod' || finalAmountWithDelivery === 0) {
      try {
        const orderId = await createOrderInDb(data, 'cod');
        // For COD, status is already 'pending_cod_payment', payment_status 'pending'
        // If amount is 0, effectively paid.
        const paymentConfirmed = finalAmountWithDelivery === 0;
        if (paymentConfirmed) {
             await supabase.from('orders').update({ status: 'processing', payment_status: 'paid' }).eq('id', orderId);
        }
        await handleSuccessfulOrderPlacement(orderId, paymentConfirmed);
      } catch (error: any) {
        console.error("Error placing COD/Zero amount order:", error);
        handlePaymentProcessError(error.message || "Could not place your order.");
      } finally {
        setIsLoading(false);
      }
    } else if (paymentMethod === 'ziina') {
      // For Ziina, the primary action is now within the ZiinaPayment component.
      // This submit might just validate and confirm details before user clicks "Pay with Ziina"
      toast({ title: "Proceed to Payment", description: "Please verify your details and click 'Pay with Ziina' in the payment section."});
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

  // Called by ZiinaPayment component on successful payment intent creation (before redirect)
  const handleZiinaPaymentSuccess = async (paymentIntentData: any) => {
    console.log("Ziina Payment Intent Success (from CheckoutForm):", paymentIntentData);
    setIsProcessingPayment(true); // Keep UI in processing state
    const formData = getValues();
    try {
      // Order should ideally be created *before* Ziina redirect, or use webhook to confirm.
      // For now, creating/updating order after Ziina intent is made, before redirect.
      // If Ziina redirects immediately, this DB operation might not complete client-side.
      // A more robust flow uses webhooks.
      // Here, we assume we can create the order, then Ziina redirects.
      // If paymentIntentData.id exists, it's the Ziina payment_intent_id.
      // If paymentIntentData.status is 'succeeded', payment is already done.
      
      const orderId = await createOrderInDb(formData, 'ziina', paymentIntentData);
      console.log(`Order ${orderId} linked with Ziina payment ${paymentIntentData.id}`);
      
      // The actual redirect to Ziina is handled by ZiinaPayment component after this callback.
      // No need to call onPaymentSuccess here, as that's for after returning from Ziina.
      // Toasting here might be premature if redirect happens.
      toast({ title: "Redirecting to Ziina...", description: "You will be redirected to complete your payment." });

    } catch (error: any) {
      console.error('Error processing Ziina success callback:', error);
      handlePaymentProcessError(error.message || 'Failed to finalize order before Ziina redirect.');
    }
    // setIsProcessingPayment(false); // ZiinaPayment component will handle its own processing state
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmitMainForm)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                {/* Assuming DeliveryOptionsComponent expects selectedOption as string ID and onOptionChange callback */}
                <DeliveryOptionsComponent 
                  deliveryOptions={deliveryOptionsList} // Pass the full list for rendering
                  selectedOption={selectedDeliveryId} 
                  onOptionChange={setSelectedDeliveryId}
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
                      <Button type="button" variant={paymentMethod === 'ziina' ? 'default' : 'outline'} onClick={() => setPaymentMethod('ziina')} className="flex-1">
                        <Smartphone className="mr-2 h-4 w-4"/> Ziina
                      </Button>
                      <Button type="button" variant={paymentMethod === 'cod' ? 'default' : 'outline'} onClick={() => setPaymentMethod('cod')} className="flex-1">Cash on Delivery</Button>
                    </div>
                    
                    {paymentMethod === 'ziina' && finalAmountWithDelivery > 0 && (
                      <ZiinaPayment
                        amount={finalAmountWithDelivery}
                        orderPayload={{ orderId: "TEMP_ORDER_ID_BEFORE_DB", metadata: { customerEmail: getValues("email") } }} // Pass necessary payload
                        onSuccess={handleZiinaPaymentSuccess} // Called when intent created, before redirect
                        onError={handlePaymentProcessError} // Called on error during intent creation
                        // isProcessing is now internal to ZiinaPayment
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
                  orderTotal={subtotal} // subtotal before delivery
                  appliedCoupon={appliedCoupon}
                />
                <GiftCardForm 
                  onGiftCardApply={applyGiftCard}
                  onGiftCardRemove={removeGiftCard}
                  orderTotal={totalPrice} // totalPrice includes coupon, before gift card & delivery
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
            // Submit button is for COD/Zero Amount or to "confirm details" before Ziina.
            // Ziina payment is initiated by its own button.
            disabled={isLoading || (paymentMethod === 'ziina' && finalAmountWithDelivery > 0 && isProcessingPayment)} 
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ShoppingBag className="mr-2 h-5 w-5" />
            )}
            {paymentMethod === 'cod' || finalAmountWithDelivery === 0 ? 'Place Order' : `Confirm Details`}
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
