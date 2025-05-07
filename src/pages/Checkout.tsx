
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartProvider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ShippingAddress } from "@/types/order";

// Define the form values interface
interface CheckoutFormValues {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  sameShipping: boolean;
  deliveryType: "standard" | "express";
  paymentMethod: "credit_card" | "paypal";
}

const Checkout = () => {
  const navigate = useNavigate();
  const { state, subtotal, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [formValues, setFormValues] = useState<CheckoutFormValues>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    sameShipping: true,
    deliveryType: "standard",
    paymentMethod: "credit_card",
  });
  
  // Additional state
  const [isProcessing, setIsProcessing] = useState(false);
  const [existingAddresses, setExistingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  
  // Calculate total with shipping
  const shipping = formValues.deliveryType === "express" ? 15 : 5;
  const total = subtotal + shipping;
  
  // Check for user and redirect if no items in cart
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Login required",
        description: "Please login to continue to checkout",
      });
      navigate("/auth?redirect=/checkout");
      return;
    }
    
    if (state.items.length === 0) {
      navigate("/cart");
    }
  }, [isLoading, user, state.items.length, navigate, toast]);
  
  // Fetch user's saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("shipping_addresses")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        if (data.shipping_addresses && data.shipping_addresses.length > 0) {
          setExistingAddresses(data.shipping_addresses);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    
    fetchAddresses();
  }, [user]);
  
  // Fill form when selecting an existing address
  useEffect(() => {
    if (selectedAddress) {
      const address = existingAddresses.find(addr => `${addr.street}-${addr.zipCode}` === selectedAddress);
      if (address) {
        setFormValues(prev => ({
          ...prev,
          name: address.name,
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
          phone: address.phone || prev.phone,
        }));
      }
    }
  }, [selectedAddress, existingAddresses]);
  
  // Update form values
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox
  const handleCheckboxChange = (checked: boolean) => {
    setFormValues(prev => ({ ...prev, sameShipping: checked }));
  };
  
  // Handle radio option changes
  const handleRadioChange = (name: keyof CheckoutFormValues, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  // Place order function
  const placeOrder = async (paymentDetails?: any) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to continue to checkout",
      });
      navigate("/auth?redirect=/checkout");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create shipping address object
      const shippingAddress: ShippingAddress = {
        name: formValues.name,
        street: formValues.street,
        city: formValues.city,
        state: formValues.state,
        zipCode: formValues.zipCode,
        country: formValues.country,
        phone: formValues.phone,
      };
      
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          status: "pending",
          payment_status: paymentDetails ? "paid" : "pending",
          payment_method: formValues.paymentMethod,
          delivery_type: formValues.deliveryType,
          shipping_address: shippingAddress
        })
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization
      }));
      
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Save address if it's new
      if (!selectedAddress) {
        try {
          await supabase.rpc('add_shipping_address', {
            user_id: user.id,
            address: shippingAddress
          });
        } catch (error) {
          console.error("Error saving address:", error);
          // Non-critical error, can continue
        }
      }
      
      // Clear cart and redirect to confirmation
      await clearCart();
      navigate(`/order-confirmation/${orderData.id}`);
      
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  // Handle form submission (for credit card)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For credit card, just place the order
    // In a real app, this would integrate with a payment processor
    if (formValues.paymentMethod === "credit_card") {
      placeOrder();
    }
  };
  
  // PayPal approval handler
  const onPayPalApprove = async (data: any) => {
    try {
      // In a real app, you would verify the payment with PayPal here
      const paymentDetails = {
        paypal_order_id: data.orderID,
        payment_status: "COMPLETED"
      };
      
      // Place the order with payment details
      await placeOrder(paymentDetails);
    } catch (error) {
      console.error("PayPal payment error:", error);
      setIsProcessing(false);
      toast({
        title: "Payment failed",
        description: "There was an error processing your PayPal payment",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="mb-8">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase by providing shipping and payment details</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-medium mb-6 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </h2>
                
                {/* Saved addresses */}
                {existingAddresses.length > 0 && (
                  <div className="mb-6">
                    <Label className="mb-2 block">Select a saved address</Label>
                    <RadioGroup 
                      value={selectedAddress || ''} 
                      onValueChange={setSelectedAddress}
                      className="gap-4"
                    >
                      {existingAddresses.map((address, index) => (
                        <div key={index} className="flex items-start space-x-2 border rounded-md p-3">
                          <RadioGroupItem 
                            value={`${address.street}-${address.zipCode}`} 
                            id={`address-${index}`} 
                          />
                          <Label 
                            htmlFor={`address-${index}`}
                            className="font-normal cursor-pointer"
                          >
                            <div>
                              <p className="font-medium">{address.name}</p>
                              <p>{address.street}</p>
                              <p>
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p>{address.country}</p>
                              {address.phone && <p>Phone: {address.phone}</p>}
                            </div>
                          </Label>
                        </div>
                      ))}
                      <div className="flex items-start space-x-2 border rounded-md p-3 border-dashed">
                        <RadioGroupItem 
                          value="" 
                          id="new-address" 
                        />
                        <Label 
                          htmlFor="new-address"
                          className="font-normal cursor-pointer"
                        >
                          <div className="font-medium">Add a new address</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
                
                {/* Address form */}
                {(!existingAddresses.length || selectedAddress === null || selectedAddress === '') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formValues.email || user?.email || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formValues.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        name="street"
                        value={formValues.street}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formValues.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State / Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formValues.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formValues.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formValues.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}
                
                {/* Same for billing */}
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sameShipping" 
                      checked={formValues.sameShipping}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="sameShipping">
                      Use this address for billing
                    </Label>
                  </div>
                </div>
                
                {/* Delivery options */}
                <div className="mt-6">
                  <Label className="mb-2 block">Delivery Options</Label>
                  <RadioGroup 
                    value={formValues.deliveryType} 
                    onValueChange={(value) => handleRadioChange("deliveryType", value)}
                  >
                    <div className="flex items-start space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="standard" id="standard-delivery" />
                      <Label htmlFor="standard-delivery" className="font-normal cursor-pointer">
                        <div className="font-medium">Standard Delivery</div>
                        <div className="text-sm text-gray-500">5-7 business days</div>
                        <div className="mt-1 font-medium text-sm">$5.00</div>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2 border rounded-md p-3 mt-3">
                      <RadioGroupItem value="express" id="express-delivery" />
                      <Label htmlFor="express-delivery" className="font-normal cursor-pointer">
                        <div className="font-medium">Express Delivery</div>
                        <div className="text-sm text-gray-500">2-3 business days</div>
                        <div className="mt-1 font-medium text-sm">$15.00</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-medium mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>
                
                <RadioGroup 
                  value={formValues.paymentMethod} 
                  onValueChange={(value) => handleRadioChange("paymentMethod", value)}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="credit_card" id="credit-card" />
                    <Label htmlFor="credit-card" className="font-normal cursor-pointer w-full">
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="flex items-center space-x-2 mt-2">
                        <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
                        <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8" />
                        <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" className="h-8" />
                      </div>
                      
                      {formValues.paymentMethod === "credit_card" && (
                        <div className="mt-4 grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input 
                              id="cardNumber" 
                              placeholder="1234 5678 9012 3456" 
                              required={formValues.paymentMethod === "credit_card"}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiration Date</Label>
                              <Input 
                                id="expiry" 
                                placeholder="MM/YY" 
                                required={formValues.paymentMethod === "credit_card"}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input 
                                id="cvv" 
                                placeholder="123" 
                                required={formValues.paymentMethod === "credit_card"}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="nameOnCard">Name on Card</Label>
                            <Input 
                              id="nameOnCard" 
                              placeholder="John Doe" 
                              required={formValues.paymentMethod === "credit_card"}
                            />
                          </div>
                        </div>
                      )}
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="font-normal cursor-pointer w-full">
                      <div className="font-medium">PayPal</div>
                      <div className="flex items-center mt-2">
                        <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-8" />
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        You will be redirected to PayPal to complete your purchase.
                      </div>
                      
                      {formValues.paymentMethod === "paypal" && (
                        <div className="mt-4">
                          <PayPalScriptProvider options={{ 
                            "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
                            currency: "USD" 
                          }}>
                            <PayPalButtons
                              style={{ layout: "horizontal" }}
                              createOrder={(_data, actions) => {
                                return actions.order.create({
                                  purchase_units: [
                                    {
                                      amount: {
                                        value: total.toFixed(2),
                                        currency_code: "USD"
                                      },
                                      description: `Order from Zyra Store - ${state.items.length} items`
                                    }
                                  ]
                                });
                              }}
                              onApprove={onPayPalApprove}
                            />
                          </PayPalScriptProvider>
                        </div>
                      )}
                    </Label>
                  </div>
                </RadioGroup>
                
                {formValues.paymentMethod === "credit_card" && (
                  <Button 
                    className="w-full mt-6" 
                    size="lg" 
                    type="submit"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Complete Order • $${total.toFixed(2)}`}
                  </Button>
                )}
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>${shipping.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-medium text-base mt-4">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Checkout;
