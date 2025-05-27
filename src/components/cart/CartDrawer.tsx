
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "./CartProvider";
import { Trash2, Plus, Minus, ShoppingBag, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { 
    isOpen, 
    toggleCart, 
    items, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    totalItems 
  } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-950/30 dark:to-pink-950/30">
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            Shopping Cart
            {totalItems > 0 && (
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-pulse">
                {totalItems}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex-1 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce-in">
                <ShoppingBag className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add some amazing products to get started</p>
              <Button 
                asChild 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/shop" onClick={toggleCart}>
                  Start Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {items.map((item, index) => (
                  <div 
                    key={`${item.id}-${index}`} 
                    className="flex items-center gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm animate-slide-in-up hover:shadow-lg transition-all duration-300"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Gift className="h-8 w-8 text-purple-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        ${item.price.toFixed(2)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="h-8 w-8 p-0 rounded-full border-purple-200 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/50"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 rounded-full border-purple-200 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/50"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  <Link to="/checkout" onClick={toggleCart}>
                    Proceed to Checkout
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
