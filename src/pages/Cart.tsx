import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart/CartProvider';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import SEOHead from '@/components/seo/SEOHead';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30">
        <SEOHead 
          title="Shopping Cart - Zyra Custom Craft"
          description="Review and manage your cart items before checkout."
        />
        <Navbar />
        
        <div className="py-16">
          <Container>
            <div className="text-center py-16 animate-bounce-in">
              <div className="relative mb-8">
                <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto animate-float" />
                <Sparkles className="h-8 w-8 text-purple-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Cart is Empty
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start shopping to find amazing products!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                    <ShoppingBag className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                    Start Shopping
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button variant="outline" className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 hover:scale-105 transition-all duration-300 group">
                    <Heart className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                    View Wishlist
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-blue-950/30">
      <SEOHead 
        title={`Shopping Cart (${itemCount}) - Zyra Custom Craft`}
        description="Review and manage your cart items before checkout."
      />
      <Navbar />
      
      <div className="py-12">
        <Container>
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="h-8 w-8 text-purple-600 animate-bounce" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <Badge className="bg-purple-600 text-white text-lg px-3 py-1 animate-pulse">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              Review your items and proceed to checkout
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 flex-shrink-0 group">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {item.name}
                            </h3>
                            <p className="text-2xl font-bold text-purple-600 animate-pulse">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-110"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Customization Details */}
                        {item.customization && (
                          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg animate-fade-in">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                              Customization:
                            </p>
                            {item.customization.text && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Text: "{item.customization.text}"
                              </p>
                            )}
                          </div>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                              className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold text-lg px-3 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                              className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Subtotal</p>
                            <p className="font-bold text-lg text-purple-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-24 border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-2xl animate-scale-in">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Order Summary
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground">Items ({itemCount})</span>
                      <span className="font-semibold">${subtotal?.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b-2 border-purple-200 dark:border-purple-800">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-semibold">Calculated at checkout</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-4">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-2xl font-bold text-purple-600 animate-pulse">
                        ${subtotal?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <Link to="/checkout" className="block">
                      <Button className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 group">
                        <ShoppingBag className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                        Proceed to Checkout
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                    
                    <Link to="/shop" className="block">
                      <Button variant="outline" className="w-full h-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  {/* Security Badges */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                    <div className="flex items-center justify-center gap-4 text-xs text-green-700 dark:text-green-300 font-medium">
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 animate-pulse" />
                        <span>Secure Checkout</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 animate-pulse" />
                        <span>Free Returns</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
