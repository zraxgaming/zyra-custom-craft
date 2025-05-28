
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customization?: Record<string, any>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart from database or localStorage
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      loadCartFromLocalStorage();
    }
  }, [user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products!cart_items_product_id_fkey (
            id,
            name,
            price,
            images
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || 'Unknown Product',
        price: item.products?.price || 0,
        quantity: item.quantity,
        customization: typeof item.customization === 'string' 
          ? JSON.parse(item.customization) 
          : item.customization || {},
        image: Array.isArray(item.products?.images) && item.products.images.length > 0 
          ? item.products.images[0] 
          : item.products?.images || '/placeholder.svg'
      }));

      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      loadCartFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  };

  const saveCartToLocalStorage = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const addItem = async (newItem: Omit<CartItem, 'id'>) => {
    const existingItem = items.find(item => item.productId === newItem.productId);
    let updatedItems: CartItem[];

    if (existingItem) {
      updatedItems = items.map(item =>
        item.productId === newItem.productId
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      );
    } else {
      const cartItem: CartItem = {
        ...newItem,
        id: crypto.randomUUID(),
      };
      updatedItems = [...items, cartItem];
    }

    setItems(updatedItems);
    
    if (user) {
      await saveCartToDatabase(updatedItems);
    } else {
      saveCartToLocalStorage(updatedItems);
    }
  };

  const saveCartToDatabase = async (cartItems: CartItem[]) => {
    if (!user) return;

    try {
      // Clear existing cart items
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      // Insert new cart items
      const cartData = cartItems.map(item => ({
        user_id: user.id,
        product_id: item.productId,
        quantity: item.quantity,
        customization: JSON.stringify(item.customization || {})
      }));

      if (cartData.length > 0) {
        const { error } = await supabase
          .from('cart_items')
          .insert(cartData);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving cart to database:', error);
    }
  };

  const removeItem = async (productId: string) => {
    const updatedItems = items.filter(item => item.productId !== productId);
    setItems(updatedItems);
    
    if (user) {
      await saveCartToDatabase(updatedItems);
    } else {
      saveCartToLocalStorage(updatedItems);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedItems = items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    
    setItems(updatedItems);
    
    if (user) {
      await saveCartToDatabase(updatedItems);
    } else {
      saveCartToLocalStorage(updatedItems);
    }
  };

  const clearCart = async () => {
    setItems([]);
    
    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      localStorage.removeItem('cart');
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
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
