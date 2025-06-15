import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types/cart';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  // Additional properties that components are expecting
  isOpen: boolean;
  toggleCart: () => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  discount: number;
  applyCoupon: (code: string) => void;
  appliedCoupon: string | null;
  removeCoupon: () => void;
  applyGiftCard: (code: string) => void;
  appliedGiftCard: string | null;
  removeGiftCard: () => void;
  giftCardAmount: number;
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [appliedGiftCard, setAppliedGiftCard] = useState<string | null>(null);
  const [giftCardAmount, setGiftCardAmount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

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
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (e) {
      console.error('Cart save error:', e);
    }
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

  // IF user is logged in, sync cart with Supabase
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        // Load cart items from Supabase if any
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);
        if (!error && data) {
          // Fetch product data to fill in name, price
          const productIds = data.map(item => item.product_id);
          const { data: products } = await supabase
            .from('products')
            .select('id, name, price, images, in_stock')
            .in('id', productIds);
          setItems(
            data.map(item => {
              const prod = products?.find(p => p.id === item.product_id);
              return {
                ...item,
                name: prod?.name || "Unknown",
                price: prod?.price || 0,
                image_url: Array.isArray(prod?.images) ? prod.images[0] : undefined,
                in_stock: prod?.in_stock ?? true
              };
            })
          );
        }
      }
    };
    syncCart();
  }, [user]);

  // Save each change to DB
  useEffect(() => {
    if (user) {
      const saveCart = async () => {
        // Remove existing
        await supabase.from('cart_items').delete().eq('user_id', user.id);
        // Insert all
        if (items.length > 0) {
          // Remove props not in cart_items table
          const pureItems = items.map(({ id, product_id, quantity, customization, user_id }) => ({
            id,
            product_id,
            quantity,
            customization,
            user_id,
          }));
          await supabase.from('cart_items').insert(pureItems);
        }
      };
      saveCart();
    } else {
      // Store in localStorage for guests
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user]);

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

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const applyCoupon = (code: string) => {
    // Mock coupon logic
    if (code === 'SAVE10') {
      setAppliedCoupon(code);
      setDiscount(10);
      toast({
        title: "Coupon applied",
        description: "10% discount applied to your order.",
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const applyGiftCard = (code: string) => {
    // Mock gift card logic
    if (code === 'GIFT50') {
      setAppliedGiftCard(code);
      setGiftCardAmount(50);
      toast({
        title: "Gift card applied",
        description: "$50 gift card applied to your order.",
      });
    } else {
      toast({
        title: "Invalid gift card",
        description: "The gift card code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const removeGiftCard = () => {
    setAppliedGiftCard(null);
    setGiftCardAmount(0);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const totalPrice = Math.max(0, subtotal - discountAmount - giftCardAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        isOpen,
        toggleCart,
        addToCart: addItem, // Alias for addItem
        removeFromCart: removeItem, // Alias for removeItem
        totalItems,
        totalPrice,
        loading,
        discount,
        applyCoupon,
        appliedCoupon,
        removeCoupon,
        applyGiftCard,
        appliedGiftCard,
        removeGiftCard,
        giftCardAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
