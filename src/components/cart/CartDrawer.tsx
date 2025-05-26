
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { isOpen, items, totalItems, subtotal, toggleCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate("/checkout");
  };

  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col animate-slide-in-right">
        <SheetHeader className="animate-fade-in">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <span>Shopping Cart</span>
            {totalItems > 0 && (
              <span className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded-full animate-scale-in">
                {totalItems}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center animate-fade-in">
            <div className="text-center space-y-4">
              <div className="p-8 bg-muted/30 rounded-full w-fit mx-auto">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">Your cart is empty</h3>
                <p className="text-muted-foreground">Add some amazing products to get started!</p>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={() => {
                  toggleCart();
                  navigate("/shop");
                }}
              >
                Start Shopping
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 animate-fade-in">
              <div className="space-y-4 py-2">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Separator />
              
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between text-sm transition-colors duration-200">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm transition-colors duration-200">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  onClick={handleCheckout}
                  size="lg"
                >
                  Proceed to Checkout
                  <span className="ml-2 text-sm opacity-80">${total.toFixed(2)}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => {
                    toggleCart();
                    navigate("/shop");
                  }}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
