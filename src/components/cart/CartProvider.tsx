
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { CartState, CartContextType, CartItem } from "@/types/cart";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const initialState: CartState = {
  isOpen: false,
  items: [],
};

type CartAction =
  | { type: "TOGGLE_CART" }
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_ITEMS"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId &&
        JSON.stringify(item.customization) === JSON.stringify(action.payload.customization)
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }

      const newItem: CartItem = {
        ...action.payload,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }
    
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };
    
    case "CLEAR_CART":
      return { ...state, items: [] };
    
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    
    default:
      return state;
  }
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
  const { user, session } = useAuth();
  const { toast } = useToast();

  // Load cart from database when user logs in
  useEffect(() => {
    if (user && session) {
      loadCartFromDatabase();
    } else {
      dispatch({ type: "CLEAR_CART" });
    }
  }, [user, session]);

  // Save cart to database when items change (debounced)
  useEffect(() => {
    if (user && session && state.items.length >= 0) {
      const timeoutId = setTimeout(() => {
        saveCartToDatabase();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.items, user, session]);

  const loadCartFromDatabase = async () => {
    if (!user || !session) return;

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          products (
            id,
            name,
            price,
            images,
            slug
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading cart:", error);
        return;
      }

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || "Unknown Product",
        quantity: item.quantity || 1,
        price: Number(item.products?.price) || 0,
        customization: item.customization || {},
        image: Array.isArray(item.products?.images) && item.products.images.length > 0 
          ? item.products.images[0] 
          : undefined,
        product: item.products ? {
          id: item.products.id,
          name: item.products.name,
          price: Number(item.products.price) || 0,
          images: Array.isArray(item.products.images) ? item.products.images : [],
          slug: item.products.slug
        } : undefined
      }));

      dispatch({ type: "SET_ITEMS", payload: cartItems });
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const saveCartToDatabase = async () => {
    if (!user || !session) return;

    try {
      // Delete existing cart items
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      // Insert new cart items
      if (state.items.length > 0) {
        const itemsToInsert = state.items.map(item => ({
          id: item.id,
          user_id: user.id,
          product_id: item.productId,
          quantity: item.quantity,
          customization: item.customization || {}
        }));

        const { error } = await supabase
          .from("cart_items")
          .insert(itemsToInsert);

        if (error) {
          console.error("Error saving cart:", error);
        }
      }
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const addItem = async (item: Omit<CartItem, "id">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    
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
    
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

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
