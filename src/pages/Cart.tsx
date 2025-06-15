import React from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Home } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const subtotal = totalPrice();
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateCartItem(id, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          {/* Navigation buttons for empty cart */}
          <div className="flex gap-3 mb-6">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button variant="secondary" onClick={() => navigate("/shop")}>
              Shop
            </Button>
            <Button variant="secondary" onClick={() => navigate("/home")}>
              <Home className="h-4 w-4 mr-1" /> Home
            </Button>
          </div>
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-8" />
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Your cart is empty
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Add some items to your cart to get started.
            </p>
            <Button 
              onClick={() => navigate("/shop")}
              className="bg-primary hover:bg-primary/90 btn-animate"
            >
              Continue Shopping
            </Button>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-12">
        {/* Navigation */}
        <div className="flex gap-3 mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button variant="secondary" onClick={() => navigate("/shop")}>
            Shop
          </Button>
          <Button variant="secondary" onClick={() => navigate("/home")}>
            <Home className="h-4 w-4 mr-1" /> Home
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 animate-fade-in"
                >
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
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
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      ${item.price.toFixed(2)} each
                    </p>
                    {item.customization && Object.keys(item.customization).length > 0 && (
                      <div className="text-sm text-primary mt-1">
                        <span className="px-2 py-1 bg-primary/20 rounded">
                          Customized
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 btn-animate"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => navigate("/shop")}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
