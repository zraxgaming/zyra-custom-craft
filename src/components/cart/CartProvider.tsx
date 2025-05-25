import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { CartItem, CartState } from '@/types/cart';

interface CartContextType {
  state: CartState;
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  addToCart: (productId: string, quantity?: number, customization?: any) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CartState>({
    items: [],
    isOpen: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setState(prev => ({ ...prev, items: [] }));
      setIsLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          customization,
          products!cart_items_product_id_fkey (
            id,
            name,
            price,
            images,
            slug
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems: CartItem[] = data?.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || 'Unknown Product',
        price: item.products?.price || 0,
        quantity: item.quantity,
        customization: item.customization,
        image: Array.isArray(item.products?.images) && item.products.images.length > 0 
          ? String(item.products.images[0]) 
          : undefined,
        product: item.products ? {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          images: Array.isArray(item.products.images) 
            ? item.products.images.map(img => String(img))
            : [],
          slug: item.products.slug || ''
        } : undefined
      })) || [];

      setState(prev => ({ ...prev, items: cartItems }));
    } catch (error: any) {
      console.error('Error fetching cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (itemData: Omit<CartItem, 'id'>) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: itemData.productId,
          quantity: itemData.quantity,
          customization: itemData.customization
        });

      if (error) throw error;

      await fetchCartItems();
      
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const addToCart = async (productId: string, quantity = 1, customization?: any) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity,
          customization
        });

      if (error) throw error;

      await fetchCartItems();
      
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = removeItem;

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      });
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

      setState(prev => ({ ...prev, items: [] }));
    } catch (error: any) {
      console.error('Error clearing cart:', error);
    }
  };

  const toggleCart = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = totalPrice;

  return (
    <CartContext.Provider value={{
      state,
      items: state.items,
      addItem,
      addToCart,
      removeItem,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      totalItems,
      totalPrice,
      subtotal,
      isLoading
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
