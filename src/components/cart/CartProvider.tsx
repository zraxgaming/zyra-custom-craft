
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customization?: Record<string, any>;
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    slug: string;
  };
};

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "TOGGLE_CART" };

type CartContextType = {
  state: CartState;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      } else {
        return { ...state, items: [...state.items, action.payload] };
      }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      return { ...state, items: updatedItems };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "SET_CART":
      return { ...state, items: action.payload };
    case "TOGGLE_CART":
      return { ...state, isCartOpen: !state.isCartOpen };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isCartOpen: false,
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: "SET_CART", payload: parsedCart });
        } catch (error) {
          console.error("Error parsing saved cart:", error);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
  }, [state.items, user]);

  useEffect(() => {
    const syncCartWithDatabase = async () => {
      if (!user) return;

      try {
        const { data: cartItems, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            product_id,
            quantity,
            customization,
            products!inner (
              id,
              name,
              price,
              images,
              slug
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        if (cartItems && cartItems.length > 0) {
          const mappedItems: CartItem[] = cartItems.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            name: item.products?.name || 'Unknown Product',
            price: item.products?.price || 0,
            quantity: item.quantity,
            image: Array.isArray(item.products?.images) && item.products.images.length > 0 
              ? item.products.images[0] 
              : undefined,
            customization: item.customization,
            product: {
              id: item.products?.id || item.product_id,
              name: item.products?.name || 'Unknown Product',
              price: item.products?.price || 0,
              images: item.products?.images || [],
              slug: item.products?.slug || ''
            }
          }));

          dispatch({ type: "SET_CART", payload: mappedItems });
        }
      } catch (error: any) {
        console.error("Error fetching cart from database:", error);
      }
    };

    if (user) {
      syncCartWithDatabase();
    }
  }, [user]);

  const addItem = async (item: Omit<CartItem, "id">) => {
    const cartItem = {
      ...item,
      id: `${item.productId}-${Date.now()}`,
    };

    dispatch({ type: "ADD_ITEM", payload: cartItem });

    if (user) {
      try {
        const { data: existingItems, error: fetchError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', item.productId);

        if (fetchError) throw fetchError;

        if (existingItems && existingItems.length > 0) {
          const existingItem = existingItems[0];
          const { error: updateError } = await supabase
            .from('cart_items')
            .update({ 
              quantity: existingItem.quantity + item.quantity,
              customization: item.customization || existingItem.customization
            })
            .eq('id', existingItem.id);

          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: item.productId,
              quantity: item.quantity,
              customization: item.customization || {}
            });

          if (insertError) throw insertError;
        }
      } catch (error: any) {
        console.error("Error adding item to database cart:", error);
        toast({
          title: "Error adding to cart",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
    });
  };

  const removeItem = async (id: string) => {
    const itemToRemove = state.items.find((item) => item.id === id);
    
    if (!itemToRemove) return;
    
    dispatch({ type: "REMOVE_ITEM", payload: id });

    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error: any) {
        console.error("Error removing item from database cart:", error);
        toast({
          title: "Error removing from cart",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, quantity },
    });

    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', id);

        if (error) throw error;
      } catch (error: any) {
        console.error("Error updating quantity in database cart:", error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error: any) {
        console.error("Error clearing database cart:", error);
      }
    }
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = state.items.reduce((total, item) => {
    // Safe access to price with fallback
    const itemPrice = item.product?.price || item.price || 0;
    return total + (itemPrice * item.quantity);
  }, 0);

  const value = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
