
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types/cart';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Check stock status for items in cart
  useEffect(() => {
    const checkStockStatus = async () => {
      if (items.length === 0) return;

      try {
        const productIds = items.map(item => item.product_id);
        const { data: products, error } = await supabase
          .from('products')
          .select('id, in_stock')
          .in('id', productIds);

        if (error) throw error;

        // Update items with current stock status
        setItems(prevItems => {
          return prevItems.map(item => {
            const product = products?.find(p => p.id === item.product_id);
            return {
              ...item,
              in_stock: product?.in_stock ?? true
            };
          });
        });
      } catch (error) {
        console.error('Error checking stock status:', error);
      }
    };

    checkStockStatus();
  }, [items.length]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    const id = Date.now().toString();
    const existingItem = items.find(item => 
      item.product_id === newItem.product_id && 
      JSON.stringify(item.customization) === JSON.stringify(newItem.customization)
    );

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + newItem.quantity);
    } else {
      setItems(prev => [...prev, { ...newItem, id }]);
      toast({
        title: "Added to cart",
        description: `${newItem.name} has been added to your cart.`,
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
