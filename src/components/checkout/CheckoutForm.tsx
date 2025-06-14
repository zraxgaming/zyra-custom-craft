import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { Loader2, ShoppingBag, CreditCard, Truck, UserCircle, Gift } from 'lucide-react';
import OrderSummary from './OrderSummary';
import CouponForm from './CouponForm';
import GiftCardForm from './GiftCardForm';
import DeliveryOptions, { DeliveryOption } from './DeliveryOptions';
import PayPalPayment from './PayPalPayment';
import ZiinaPayment from './ZiinaPayment'; // Ensure this path is correct
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

const CheckoutForm: React.FC = () => {
  const { items, clearCart, totalPrice, applyCoupon, appliedCoupon, removeCoupon, applyGiftCard, appliedGiftCard, removeGiftCard } = useCart();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'ziina' | 'cod'>('paypal');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption | null>(null);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      country: 'UAE', // Default country
    },
  });

  useEffect(() => {
    if (user && profile) {
      setValue('firstName', profile.first_name || '');
      setValue('lastName', profile.last_name || '');
      setValue('email', user.email || '');
      setValue('phone', profile.phone || '');
      // Potentially load address from profile if available
    } else if (user) {
      setValue('email', user.email || '');
    }
  }, [user, profile, setValue]);

  const finalAmount = appliedGiftCard 
    ? Math.max(0, totalPrice - (appliedGiftCard.amount || 0))
    : totalPrice;

  const handlePaymentSuccess = async (orderId: string) => {
    toast({
      title: "Order Placed!",
      description: `Your order #${orderId} has been placed successfully.`,
    });
    await clearCart();
    navigate(`/order-success/${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    setIsLoading(false);
  };
  
  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    if (!selectedDelivery) {
      toast({ title: "Error", description: "Please select a delivery option.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (paymentMethod !== 'cod' && finalAmount > 0) {
      // For PayPal or Ziina, payment is handled by their respective components.
      // This function will be called by those components on success.
      // We just need to ensure data is ready for them.
      // If payment is handled client-side completely by PayPal/Ziina components,
      // then the actual order creation logic might move into `handlePaymentSuccess`.
      // For now, let's assume order creation happens after client-side payment success.
      // This might need adjustment based on how PayPal/Ziina components trigger success.
       toast({
        title: `Proceeding with ${paymentMethod}`,
        description: "Please complete the payment.",
      });
      // The actual submission to backend will happen in handlePaymentSuccess after PayPal/Ziina confirms
      setIsLoading(false); 
      return;
    }
    
    // For COD or if finalAmount is 0 after gift card
    try {
      const orderData = {
        user_id: user?.id,
        profile_id: profile?.id,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization,
          name: item.name, // Include name for better order details
          image_url: item.image_url // Include image_url
        })),
        total_amount: finalAmount + (selectedDelivery?.price || 0),
        shipping_address: data,
        billing_address: data, // Assuming same as shipping for now
        status: 'pending',
        currency: 'AED', // Assuming AED
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid', // This might change based on actual payment flow
        delivery_type: selectedDelivery.name,
        tracking_number: null,
        notes: `Selected delivery: ${selectedDelivery.name} (+${selectedDelivery.price} AED). Coupon: ${appliedCoupon?.code || 'None'}. Gift Card: ${appliedGiftCard?.code || 'None'}`,
        coupon_id: appliedCoupon?.id,
        gift_card_id: appliedGiftCard?.id,
        shipping_cost: selectedDelivery.price,
      };

      const { data: orderResult, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;
      
      // For COD, we call handlePaymentSuccess directly as no external payment step
      if (paymentMethod === 'cod' || finalAmount === 0) {
         await handlePaymentSuccess(orderResult.id);
      }

    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Placement Failed",
        description: error.message || "Could not place your order. Please try again.",
        variant: "destructive",
      });
    } finally {
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
        <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
      </div>
    );
  }
  
  const createOrderForPaymentGateway = async (formData: AddressFormData) => {
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
      total_amount: finalAmount + (selectedDelivery.price || 0),
      shipping_address: formData,
      billing_address: formData, 
      status: 'pending_payment', // Special status for gateway payments
      currency: 'AED',
      payment_method: paymentMethod,
      payment_status: 'pending',
      delivery_type: selectedDelivery.name,
      notes: `Coupon: ${appliedCoupon?.code || 'None'}. Gift Card: ${appliedGiftCard?.code || 'None'}`,
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
    return orderResult.id; // Return the preliminary order ID
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
                    {/* Form Fields */}
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
                <DeliveryOptions selectedOption={selectedDelivery} onSelectOption={setSelectedDelivery} />
                {!selectedDelivery && <p className="text-red-500 text-sm mt-1">Please select a delivery option.</p>}
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
                      <Button variant={paymentMethod === 'paypal' ? 'default' : 'outline'} onClick={() => setPaymentMethod('paypal')} className="flex-1">PayPal</Button>
                      <Button variant={paymentMethod === 'ziina' ? 'default' : 'outline'} onClick={() => setPaymentMethod('ziina')} className="flex-1">Ziina</Button>
                      <Button variant={paymentMethod === 'cod' ? 'default' : 'outline'} onClick={() => setPaymentMethod('cod')} className="flex-1">Cash on Delivery</Button>
                    </div>
                    {paymentMethod === 'paypal' && finalAmount > 0 && (
                      <PayPalPayment 
                        amount={finalAmount + (selectedDelivery?.price || 0)}
                        currency="AED"
                        onSuccess={async () => {
                          // This assumes form data is valid by the time PayPal is clicked.
                          // A better UX might validate and create preliminary order *before* showing PayPal button.
                          const formData = control._formValues;
                          const orderId = await createOrderForPaymentGateway(formData);
                          // Update order status to 'paid'
                           await supabase.from('orders').update({ payment_status: 'paid', status: 'processing' }).eq('id', orderId);
                          await handlePaymentSuccess(orderId);
                        }}
                        onError={handlePaymentError}
                      />
                    )}
                    {paymentMethod === 'ziina' && finalAmount > 0 && (
                       <ZiinaPayment
                        amount={finalAmount + (selectedDelivery?.price || 0)}
                        onSuccess={async (transactionId) => {
                          const formData = control._formValues;
                          const orderId = await createOrderForPaymentGateway(formData);
                           // Update order status to 'paid' and include transactionId
                           await supabase.from('orders').update({ 
                            payment_status: 'paid', 
                            status: 'processing',
                            notes: `${control._formValues.notes || ''} Ziina TxID: ${transactionId}`.trim()
                           }).eq('id', orderId);
                          await handlePaymentSuccess(orderId);
                        }}
                        onError={handlePaymentError}
                      />
                    )}
                    {paymentMethod === 'cod' && (
                      <p className="text-sm text-muted-foreground">You will pay upon delivery.</p>
                    )}
                     {finalAmount === 0 && <p className="text-sm text-green-600">Your order total is 0 AED. No payment required.</p>}
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
                  onApplyCoupon={applyCoupon} 
                  onRemoveCoupon={removeCoupon}
                  appliedCouponCode={appliedCoupon?.code} 
                />
                <GiftCardForm 
                  onApplyGiftCard={applyGiftCard}
                  onRemoveGiftCard={removeGiftCard}
                  appliedGiftCardCode={appliedGiftCard?.code}
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
            disabled={isLoading || (paymentMethod !== 'cod' && finalAmount > 0)} // Disable if payment handled by gateway
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ShoppingBag className="mr-2 h-5 w-5" />
            )}
            {paymentMethod === 'cod' || finalAmount === 0 ? 'Place Order' : `Proceed to ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
