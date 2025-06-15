import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Define the types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  price: number;
  image_url: string;
  name?: string;
  customization?: Json;
}

interface CartContextType {
  cart: CartItem[];
  items: CartItem[];
  addToCart: (
    product: Omit<CartItem, "id" | "quantity" | "user_id">,
    quantity: number,
    customization?: Json
  ) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateCartItem: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: () => number;
  totalPrice: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = () => {
      if (user) {
        loadCartFromDb();
      }
    };
    if (user) {
      loadCartFromDb();
      intervalRef.current = setInterval(poll, 5000);
    } else {
      setCart([]);
    }
    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [user]);

  const loadCartFromDb = async () => {
    setIsLoading(true);
    try {
      const { data: dbCart, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user?.id);

      if (!error && dbCart) {
        // Provide safe fallback for price, name, image_url!
        setCart(
          dbCart.map((item: any) => ({
            ...item,
            price: typeof item.price === "number" ? item.price : 0,
            image_url: typeof item.image_url === "string" ? item.image_url : "",
            name: typeof item.name === "string" ? item.name : "",
            customization: item.customization ?? {},
          }))
        );
      }
    } catch (err) {
      console.error("Error loading cart from database:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (
    product: Omit<CartItem, "id" | "quantity" | "user_id">,
    quantity: number,
    customization: Json = {}
  ) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .insert([
          {
            product_id: product.product_id,
            user_id: user.id,
            quantity: quantity,
            price: product.price,
            image_url: product.image_url,
            name: product.name,
            customization: customization,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding to cart:", error);
        return;
      }

      setCart((prevCart) => [
        ...prevCart,
        {
          ...data,
          price: data.price || 0,
          image_url: data.image_url || "",
          name: data.name || "",
          customization: data.customization ?? {},
        } as CartItem
      ]);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", id);

      if (error) {
        console.error("Error removing from cart:", error);
        return;
      }

      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const updateCartItem = async (id: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", id);

      if (error) {
        console.error("Error updating cart item:", error);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  const clearCart = async () => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error clearing cart:", error);
        return;
      }

      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const totalItems = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const totalPrice = () => {
    return cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  const value: CartContextType = {
    cart,
    items: cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    totalItems,
    totalPrice,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };

// ... NOTE: This file is getting long, consider refactoring if more cart logic is needed!
