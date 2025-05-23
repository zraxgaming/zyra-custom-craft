
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { executeSql } from "@/lib/sql-helper";

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

  // Sync with localStorage for non-logged in users
  useEffect(() => {
    if (!user) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        dispatch({ type: "SET_CART", payload: JSON.parse(savedCart) });
      }
    }
  }, [user]);

  // Save to localStorage when cart changes (for non-logged in users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
  }, [state.items, user]);

  // Sync with database when logged in
  useEffect(() => {
    const syncCartWithDatabase = async () => {
      if (!user) return;

      try {
        const cartItems = await executeSql(`
          SELECT 
            ci.id,
            ci.product_id,
            ci.quantity,
            ci.customization,
            p.name,
            p.price,
            p.images
          FROM cart_items ci
          LEFT JOIN products p ON ci.product_id = p.id
          WHERE ci.user_id = '${user.id}'
        `);

        if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
          const mappedItems = cartItems.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : undefined,
            customization: item.customization,
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

  // Add item to cart
  const addItem = async (item: Omit<CartItem, "id">) => {
    const cartItem = {
      ...item,
      id: `${item.productId}-${Date.now()}`,
    };

    dispatch({ type: "ADD_ITEM", payload: cartItem });

    if (user) {
      try {
        const existingItems = await executeSql(`SELECT * FROM cart_items WHERE user_id = '${user.id}' AND product_id = '${item.productId}'`);

        if (existingItems && Array.isArray(existingItems) && existingItems.length > 0) {
          const existingItem = existingItems[0];
          await executeSql(`UPDATE cart_items SET 
                    quantity = ${existingItem.quantity + item.quantity},
                    customization = '${JSON.stringify(item.customization || existingItem.customization)}'
                  WHERE id = '${existingItem.id}'`);
        } else {
          await executeSql(`INSERT INTO cart_items (user_id, product_id, quantity, customization) 
                  VALUES ('${user.id}', '${item.productId}', ${item.quantity}, '${JSON.stringify(item.customization || {})}')`);
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

  // Remove item from cart
  const removeItem = async (id: string) => {
    const itemToRemove = state.items.find((item) => item.id === id);
    
    if (!itemToRemove) return;
    
    dispatch({ type: "REMOVE_ITEM", payload: id });

    if (user) {
      try {
        await executeSql(`DELETE FROM cart_items WHERE id = '${id}'`);
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
        await executeSql(`UPDATE cart_items SET quantity = ${quantity} WHERE id = '${id}'`);
      } catch (error: any) {
        console.error("Error updating quantity in database cart:", error);
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    if (user) {
      try {
        await executeSql(`DELETE FROM cart_items WHERE user_id = '${user.id}'`);
      } catch (error: any) {
        console.error("Error clearing database cart:", error);
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
