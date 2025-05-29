
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: Record<string, any>;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  subtotal: number;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          customization,
          products:product_id (
            name,
            price,
            images
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems: CartItem[] = data?.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || '',
        price: item.products?.price || 0,
        quantity: item.quantity,
        customization: typeof item.customization === 'object' && item.customization !== null 
          ? item.customization as Record<string, any> 
          : {},
        image: Array.isArray(item.products?.images) && item.products.images.length > 0
          ? String(item.products.images[0])
          : '/placeholder-product.jpg'
      })) || [];

      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (newItem: Omit<CartItem, 'id'>) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if item already exists
      const existingItem = items.find(item => 
        item.productId === newItem.productId && 
        JSON.stringify(item.customization) === JSON.stringify(newItem.customization)
      );

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + newItem.quantity);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: newItem.productId,
          quantity: newItem.quantity,
          customization: newItem.customization || {}
        });

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
