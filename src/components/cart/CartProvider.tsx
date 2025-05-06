
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customization?: Record<string, any>;
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
        // Item exists, increase quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      } else {
        // New item
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

  // Sync with localStorage for non-logged in users
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    
    if (savedCart) {
      dispatch({ type: "SET_CART", payload: JSON.parse(savedCart) });
    }
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
  }, [state.items, user]);

  // Sync with Supabase when logged in
  useEffect(() => {
    const syncCartWithSupabase = async () => {
      if (!user) return;

      try {
        // Get the user's cart from Supabase
        const { data: cartItems, error } = await supabase
          .from("cart_items")
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
          .eq("user_id", user.id);

        if (error) throw error;

        if (cartItems && cartItems.length > 0) {
          // Map Supabase data to cart items format
          const mappedItems = cartItems.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            name: item.products.name,
            price: item.products.price,
            quantity: item.quantity,
            image: item.products.images?.[0] || undefined,
            customization: item.customization,
          }));

          dispatch({ type: "SET_CART", payload: mappedItems });
        }
      } catch (error: any) {
        console.error("Error fetching cart from Supabase:", error);
      }
    };

    if (user) {
      syncCartWithSupabase();
    }
  }, [user]);

  // Add item to cart
  const addItem = async (item: Omit<CartItem, "id">) => {
    const cartItem = {
      ...item,
      id: `${item.productId}-${Date.now()}`,
    };

    dispatch({ type: "ADD_ITEM", payload: cartItem });

    if (user) {
      try {
        // Check if product already exists in user's cart
        const { data: existingItems, error: fetchError } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", item.productId);

        if (fetchError) throw fetchError;

        if (existingItems && existingItems.length > 0) {
          // Update quantity
          const existingItem = existingItems[0];
          const { error } = await supabase
            .from("cart_items")
            .update({ 
              quantity: existingItem.quantity + item.quantity,
              customization: item.customization || existingItem.customization
            })
            .eq("id", existingItem.id);

          if (error) throw error;
        } else {
          // Insert new item
          const { error } = await supabase.from("cart_items").insert({
            user_id: user.id,
            product_id: item.productId,
            quantity: item.quantity,
            customization: item.customization,
          });

          if (error) throw error;
        }
      } catch (error: any) {
        console.error("Error adding item to Supabase cart:", error);
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

  // Remove item from cart
  const removeItem = async (id: string) => {
    const itemToRemove = state.items.find((item) => item.id === id);
    
    if (!itemToRemove) return;
    
    dispatch({ type: "REMOVE_ITEM", payload: id });

    if (user) {
      try {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", id);

        if (error) throw error;
      } catch (error: any) {
        console.error("Error removing item from Supabase cart:", error);
        toast({
          title: "Error removing from cart",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  // Update quantity
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
          .from("cart_items")
          .update({ quantity })
          .eq("id", id);

        if (error) throw error;
      } catch (error: any) {
        console.error("Error updating quantity in Supabase cart:", error);
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    if (user) {
      try {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id);

        if (error) throw error;
      } catch (error: any) {
        console.error("Error clearing Supabase cart:", error);
      }
    }
  };

  // Toggle cart visibility
  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  // Calculate total items
  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate subtotal
  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
