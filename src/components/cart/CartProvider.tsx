
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartItem, CartState, CartContextType } from "@/types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  isLoading: false,
};

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    case "ADD_ITEM":
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };
        return { ...state, items: updatedItems };
      }
      
      return { ...state, items: [...state.items, action.payload] };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart from localStorage on component mount
  useEffect(() => {
    if (!user) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: "SET_ITEMS", payload: parsedCart });
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      }
    }
  }, [user]);

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    }
  }, [user]);

  // Save cart to localStorage when items change (for non-logged-in users)
  useEffect(() => {
    if (!user && state.items.length >= 0) {
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
  }, [state.items, user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          products!cart_items_product_id_fkey (
            id,
            name,
            price,
            images,
            slug
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map(item => ({
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        price: item.products?.price || 0,
        customization: item.customization,
        product: item.products ? {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          images: item.products.images || [],
          slug: item.products.slug
        } : undefined
      }));

      dispatch({ type: "SET_ITEMS", payload: cartItems });
    } catch (error: any) {
      console.error("Error fetching cart from database:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToCart = async (productId: string, quantity: number = 1, customization?: any) => {
    try {
      // Get product details
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, name, price, images, slug")
        .eq("id", productId)
        .single();

      if (productError) throw productError;

      const cartItem: CartItem = {
        id: `temp-${Date.now()}`,
        productId,
        quantity,
        price: product.price,
        customization,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images || [],
          slug: product.slug
        }
      };

      if (user) {
        // Save to database
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            customization
          })
          .select()
          .single();

        if (error) throw error;

        cartItem.id = data.id;
      }

      dispatch({ type: "ADD_ITEM", payload: cartItem });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
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

      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      if (user) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", id);

        if (error) throw error;
      }

      dispatch({ type: "REMOVE_ITEM", payload: id });

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
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
      } else {
        localStorage.removeItem("cart");
      }

      dispatch({ type: "CLEAR_CART" });
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const itemPrice = item.product?.price || item.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
