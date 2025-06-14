
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  customization?: {
    text?: string;
    images?: string[];
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    rotation?: number;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  addItem: (item: Omit<CartItem, "id">) => void; // Alias for addToCart
  removeFromCart: (itemId: string) => void;
  removeItem: (itemId: string) => void; // Alias for removeFromCart
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalItems: number; // Alias for itemCount
  subtotal: number;
  totalPrice: number; // Alias for subtotal
  loading: boolean;
  isOpen: boolean;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user]);

  const toggleCart = () => setIsOpen(!isOpen);

  const loadCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          customization,
          products!cart_items_product_id_fkey (
            name,
            price,
            images
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.products?.name || 'Unknown Product',
        price: item.products?.price || 0,
        quantity: item.quantity,
        image_url: Array.isArray(item.products?.images) && item.products.images.length > 0 
          ? String(item.products.images[0])
          : undefined,
        customization: item.customization ? 
          (typeof item.customization === 'object' ? item.customization as CartItem['customization'] : undefined) : 
          undefined
      }));

      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (newItem: Omit<CartItem, "id">) => {
    const cartItem: CartItem = {
      ...newItem,
      id: `${newItem.product_id}-${Date.now()}`
    };

    if (user) {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: newItem.product_id,
            quantity: newItem.quantity,
            customization: newItem.customization
          })
          .select()
          .single();

        if (error) throw error;
        cartItem.id = data.id;
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          variant: "destructive",
        });
        return;
      }
    }

    setItems(prev => [...prev, cartItem]);
    
    toast({
      title: "Added to cart ✨",
      description: `${newItem.name} has been added to your cart`,
    });
  };

  const removeFromCart = async (itemId: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
      } catch (error) {
        console.error('Error removing from cart:', error);
        return;
      }
    }

    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating quantity:', error);
        return;
      }
    }

    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = async () => {
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
    
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      addItem: addToCart, // Alias
      removeFromCart,
      removeItem: removeFromCart, // Alias
      updateQuantity,
      clearCart,
      itemCount,
      totalItems: itemCount, // Alias
      subtotal,
      totalPrice: subtotal, // Alias
      loading,
      isOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
