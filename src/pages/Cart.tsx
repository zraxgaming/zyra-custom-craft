import React from "react";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { state, removeItem, updateQuantity, totalItems, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to continue to checkout",
      });
      navigate("/auth?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <Navbar />
      <Container className="py-12 bg-background text-foreground">
        <h1 className="text-3xl font-bold mb-6 text-primary-foreground">Your Shopping Cart</h1>
        
        {state.items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-card rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-card-foreground" />
            </div>
            <h2 className="text-2xl font-medium mb-2 text-primary-foreground">Your cart is empty</h2>
            <p className="text-foreground">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button
              className="mt-6 bg-primary hover:bg-secondary text-primary-foreground"
              onClick={() => navigate("/shop")}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Product</th>
                        <th className="text-center p-4">Quantity</th>
                        <th className="text-right p-4">Price</th>
                        <th className="text-right p-4">Total</th>
                        <th className="text-right p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="h-16 w-16 bg-gray-100 rounded mr-4 overflow-hidden flex-shrink-0">
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
                              <div>
                                <h3 className="font-medium">{item.name}</h3>
                                {item.customization && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {Object.entries(item.customization).map(([key, value]) => (
                                      <p key={key}>
                                        {key}: {String(value)}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-4 text-right font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash className="h-4 w-4 text-gray-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navigate("/shop")}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Items ({totalItems})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Shipping and taxes calculated at checkout
                    </p>
                  </div>
                </div>
                
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
