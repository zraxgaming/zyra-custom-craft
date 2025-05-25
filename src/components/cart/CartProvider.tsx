
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { CartItem, CartState, CartContextType } from "@/types/cart";
import type { Json } from "@/integrations/supabase/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<CartState>({
    isOpen: false,
    items: [],
  });

  // Calculate totals
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      // Clear cart when user logs out
      setState(prev => ({ ...prev, items: [] }));
    }
  }, [user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
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
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching cart from database:", error);
        return;
      }

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.products?.name || "Unknown Product",
        productId: item.products?.id || '',
        quantity: item.quantity,
        price: item.products?.price || 0,
        customization: item.customization,
        image: Array.isArray(item.products?.images) && item.products.images.length > 0 
          ? item.products.images[0] 
          : undefined,
        product: item.products ? {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          images: Array.isArray(item.products.images) ? item.products.images : [],
          slug: item.products.slug
        } : undefined
      }));

      setState(prev => ({ ...prev, items: cartItems }));
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const toggleCart = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const addItem = async (newItem: Omit<CartItem, 'id'>) => {
    try {
      // Check if item already exists in cart
      const existingItem = state.items.find(item => 
        item.productId === newItem.productId && 
        JSON.stringify(item.customization) === JSON.stringify(newItem.customization)
      );

      if (existingItem) {
        // Update quantity if item exists
        await updateQuantity(existingItem.id, existingItem.quantity + newItem.quantity);
        return;
      }

      if (user) {
        // Add to database if user is logged in
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: newItem.productId,
            quantity: newItem.quantity,
            customization: newItem.customization as Json,
          })
          .select()
          .single();

        if (error) throw error;

        const cartItem: CartItem = {
          id: data.id,
          name: newItem.name,
          productId: newItem.productId,
          quantity: newItem.quantity,
          price: newItem.price,
          customization: newItem.customization,
          image: newItem.image,
          product: newItem.product,
        };

        setState(prev => ({
          ...prev,
          items: [...prev.items, cartItem]
        }));
      } else {
        // Add to local state if user is not logged in
        const cartItem: CartItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: newItem.name,
          productId: newItem.productId,
          quantity: newItem.quantity,
          price: newItem.price,
          customization: newItem.customization,
          image: newItem.image,
          product: newItem.product,
        };

        setState(prev => ({
          ...prev,
          items: [...prev.items, cartItem]
        }));
      }

      toast({
        title: "Added to cart",
        description: `${newItem.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (id: string) => {
    try {
      if (user) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", id);

        if (error) throw error;
      }

      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      if (user) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("id", id);

        if (error) throw error;
      }

      setState(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      }));
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id);

        if (error) throw error;
      }

      setState(prev => ({ ...prev, items: [] }));
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    }
  };

  const value: CartContextType = {
    state,
    items: state.items,
    totalItems,
    subtotal,
    toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export type { CartItem };
