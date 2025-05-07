
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

const CartDrawer: React.FC = () => {
  const { state, toggleCart, removeItem, updateQuantity, totalItems, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    toggleCart();
    navigate("/shop");
  };

  const handleViewCart = () => {
    toggleCart();
    navigate("/cart");
  };

  return (
    <Sheet open={state.isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-2.5 mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart ({totalItems})
            </SheetTitle>
          </div>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="bg-muted h-24 w-24 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">Your cart is empty</h3>
              <p className="text-muted-foreground">
                Looks like you haven't added anything to your cart yet.
              </p>
            </div>
            <Button onClick={handleContinueShopping}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <ul className="divide-y">
                {state.items.map((item) => (
                  <li key={item.id} className="py-4 flex">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>

                      <div className="flex mt-auto justify-between items-center">
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

                        <button
                          type="button"
                          className="text-sm font-medium text-zyra-purple hover:text-zyra-purple/80"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <Separator className="mb-4" />
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>

              <SheetFooter className="mt-6 flex-col gap-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={handleViewCart}
                  className="w-full"
                >
                  View Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleContinueShopping}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
