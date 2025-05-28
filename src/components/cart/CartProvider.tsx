
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: Record<string, any>;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

const initialState: CartState = {
  items: [],
  isOpen: false,
  totalItems: 0,
  totalPrice: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[];
  
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(item => 
        item.productId === action.payload.productId &&
        JSON.stringify(item.customization) === JSON.stringify(action.payload.customization)
      );
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, id: `${action.payload.productId}-${Date.now()}` }];
      }
      break;

    case "REMOVE_ITEM":
      newItems = state.items.filter(item => item.id !== action.payload);
      break;

    case "UPDATE_QUANTITY":
      newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      break;

    case "CLEAR_CART":
      newItems = [];
      break;

    case "SET_ITEMS":
      newItems = action.payload;
      break;

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    default:
      return state;
  }

  const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    ...state,
    items: newItems,
    totalItems,
    totalPrice,
  };
}

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity: number, customization?: Record<string, any>) => Promise<void>;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
}

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
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart items when user changes
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      dispatch({ type: "CLEAR_CART" });
    }
  }, [user]);

  // Save cart to database whenever items change
  useEffect(() => {
    if (user && state.items.length >= 0) {
      saveCartToDatabase();
    }
  }, [state.items, user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (name, price, images)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || 'Unknown Product',
        price: item.products?.price || 0,
        quantity: item.quantity,
        customization: item.customization,
        image: Array.isArray(item.products?.images) && item.products.images.length > 0 
          ? item.products.images[0] 
          : '/placeholder.svg'
      }));

      dispatch({ type: "SET_ITEMS", payload: cartItems });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCartToDatabase = async () => {
    if (!user) return;

    try {
      // Delete existing cart items
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      // Insert current cart items
      if (state.items.length > 0) {
        const cartData = state.items.map(item => ({
          user_id: user.id,
          product_id: item.productId,
          quantity: item.quantity,
          customization: item.customization
        }));

        await supabase
          .from('cart_items')
          .insert(cartData);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = async (productId: string, quantity: number, customization?: Record<string, any>) => {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('name, price, images')
        .eq('id', productId)
        .single();

      if (error) throw error;

      if (!product) {
        throw new Error('Product not found');
      }

      const cartItem: CartItem = {
        id: `${productId}-${Date.now()}`,
        productId,
        name: product.name,
        price: product.price,
        quantity,
        customization,
        image: Array.isArray(product.images) && product.images.length > 0 
          ? product.images[0] 
          : '/placeholder.svg'
      };

      dispatch({ type: "ADD_ITEM", payload: cartItem });

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const addItem = async (item: Omit<CartItem, 'id'>) => {
    const cartItem: CartItem = {
      ...item,
      id: `${item.productId}-${Date.now()}`
    };

    dispatch({ type: "ADD_ITEM", payload: cartItem });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const openCart = () => {
    dispatch({ type: "OPEN_CART" });
  };

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        addItem,
        removeFromCart,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        subtotal: state.totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
