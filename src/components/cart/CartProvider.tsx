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
  subtotal: number;
  discount: number;
  giftCardAmount: number;
  setCoupon: (coupon: any) => void;
  setGiftCard: (giftCard: any) => void;
  coupon: any;
  giftCard: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coupon, setCoupon] = useState<any>(null);
  const [giftCard, setGiftCard] = useState<any>(null);
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

  // always ensure customization is loaded/saved properly
  const loadCartFromDb = async () => {
    setIsLoading(true);
    try {
      const { data: dbCart, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user?.id);

      if (!error && dbCart) {
        setCart(
          dbCart.map((item: any) => ({
            ...item,
            price: typeof item.price === "number" ? item.price : 0,
            image_url: typeof item.image_url === "string" ? item.image_url : "",
            name: typeof item.name === "string" ? item.name : "",
            customization: item.customization ?? {}, // ensure customization is always an object or {}
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
    product,
    quantity,
    customization = {}
  ) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }
    // Check product stock from Supabase directly for freshness
    let productRes = await supabase
      .from("products")
      .select("id, stock_quantity")
      .eq("id", product.product_id)
      .maybeSingle();

    const maxStock =
      typeof productRes.data?.stock_quantity === "number"
        ? productRes.data?.stock_quantity
        : 99;

    // Check how much is in cart for this customization
    const itemInCart = cart.find(
      (item) =>
        item.product_id === product.product_id &&
        JSON.stringify(item.customization || {}) ===
          JSON.stringify(customization || {})
    );
    const cartQty = itemInCart ? itemInCart.quantity : 0;
    const totalDesired = cartQty + quantity;

    if (totalDesired > maxStock) {
      console.log("Attempted to add above stock level.");
      return;
    }

    if (
      product.name?.toLowerCase().includes("custom") &&
      (!customization || Object.keys(customization).length === 0)
    ) {
      console.log("Customization required for this product.");
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
        }
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
      const item = cart.find((it) => it.id === id);
      if (!item) return;
      // Fetch latest product stock
      let productRes = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .maybeSingle();
      const maxStock =
        typeof productRes.data?.stock_quantity === "number"
          ? productRes.data?.stock_quantity
          : 99;
      if (quantity > maxStock) return;

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

  const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const discount = coupon
    ? coupon.discount_type === "percentage"
      ? subtotal * coupon.discount_value / 100
      : coupon.discount_value
    : 0;
  const giftCardAmount = giftCard ? Math.min(giftCard.amount, subtotal - discount) : 0;
  const totalCartPrice = () => subtotal - discount - giftCardAmount;

  const totalItems = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    items: cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    totalItems,
    totalPrice: totalCartPrice,
    isLoading,
    subtotal,
    discount,
    giftCardAmount,
    setCoupon,
    setGiftCard,
    coupon,
    giftCard,
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
