import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CartItem, CartItemCustomization } from '@/types/cart'; // Ensure CartItemCustomization is imported if needed elsewhere, CartItem uses it internally

// export interface CartItem previously defined here, now imported from @/types/cart

interface AppliedCoupon {
  code: string;
  discountAmount: number; // Or percentage, adjust as needed
  // id might be useful for removal or tracking
  id?: string; 
}

interface AppliedGiftCard {
  code: string;
  amount: number;
   // id might be useful
  id?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  addItem: (item: Omit<CartItem, "id">) => void; // Alias for addToCart
  removeFromCart: (itemId: string) => void;
  removeItem: (itemId: string) => void; // Alias for removeFromCart
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalItems: number; // Alias for itemCount
  subtotal: number;
  totalPrice: number; 
  loading: boolean;
  isOpen: boolean;
  toggleCart: () => void;

  // Coupon and Gift Card related fields
  applyCoupon: (couponCode: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  appliedCoupon: AppliedCoupon | null;
  applyGiftCard: (giftCardCode: string) => Promise<void>;
  removeGiftCard: () => Promise<void>;
  appliedGiftCard: AppliedGiftCard | null;
  giftCardAmount: number;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // State for coupons and gift cards
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [appliedGiftCard, setAppliedGiftCard] = useState<AppliedGiftCard | null>(null);

  useEffect(() => {
    if (user) {
      loadCart();
      // Potentially load applied coupon/gift card for user session from backend
    } else {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
      // Load coupon/gift card from localStorage if desired for guests
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items));
      // Save coupon/gift card to localStorage if desired for guests
    }
  }, [items, user]);

  const toggleCart = () => setIsOpen(!isOpen);

  const loadCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          customization,
          products!cart_items_product_id_fkey (
            name,
            price,
            images
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map((dbItem: any) => ({ // Explicitly type dbItem as any
        id: dbItem.id,
        product_id: dbItem.product_id,
        name: dbItem.products?.name || 'Unknown Product',
        price: dbItem.products?.price || 0,
        quantity: dbItem.quantity,
        image_url: Array.isArray(dbItem.products?.images) && dbItem.products.images.length > 0 
          ? String(dbItem.products.images[0])
          : undefined,
        customization: dbItem.customization ? 
          (typeof dbItem.customization === 'object' ? dbItem.customization as CartItemCustomization : undefined) : 
          undefined
      }));

      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (newItem: Omit<CartItem, "id">) => {
    const existingItem = items.find(
      (item) =>
        item.product_id === newItem.product_id &&
        JSON.stringify(item.customization) === JSON.stringify(newItem.customization)
    );

    let cartItem: CartItem;

    if (existingItem) {
      // Update quantity of existing item
      const newQuantity = existingItem.quantity + newItem.quantity;
      updateQuantity(existingItem.id, newQuantity); // This will also handle DB update if user is logged in
      toast({
        title: "Cart Updated",
        description: `${newItem.name} quantity updated to ${newQuantity}.`,
      });
      return; // Early return as updateQuantity handles items state
    } else {
      // Add as new item
      cartItem = {
        ...newItem,
        id: `${newItem.product_id}-${JSON.stringify(newItem.customization)}-${Date.now()}`, // More unique ID
      };
    }
    
    if (user) {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: newItem.product_id,
            quantity: newItem.quantity,
            customization: newItem.customization as any, // Cast to any if Supabase types mismatch
          })
          .select()
          .single();

        if (error) throw error;
        // Use DB generated ID for consistency
        const dbAddedItem: CartItem = {
            id: data.id,
            product_id: newItem.product_id,
            name: newItem.name,
            price: newItem.price,
            quantity: newItem.quantity,
            image_url: newItem.image_url,
            customization: newItem.customization,
        };
        setItems(prev => [...prev, dbAddedItem]);

      } catch (error) {
        console.error('Error adding to cart in DB:', error);
        toast({
          title: "Error",
          description: "Failed to save item to cart in database.",
          variant: "destructive",
        });
         // Optionally add to local state anyway for UX, or revert
        setItems(prev => [...prev, cartItem]); // Add locally as fallback
        // return; 
      }
    } else {
        setItems(prev => [...prev, cartItem]);
    }
    
    toast({
      title: "Added to cart ✨",
      description: `${newItem.name} has been added to your cart`,
    });
  };

  const removeFromCart = async (itemId: string) => {
    const itemToRemove = items.find(item => item.id === itemId);
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId); // Assuming itemId is the DB id if user is logged in

        if (error) throw error;
      } catch (error: any) {
        console.error('Error removing from cart in DB:', error);
        toast({
            title: "Error",
            description: `Failed to remove item from database: ${error.message}`,
            variant: "destructive",
        });
        // return; // Decide if UI should update even if DB fails
      }
    }
    setItems(prev => prev.filter(item => item.id !== itemId));
    if (itemToRemove) {
        toast({
            title: "Item Removed",
            description: `${itemToRemove.name} removed from cart.`,
        });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const itemToUpdate = items.find(item => item.id === itemId);
    if (!itemToUpdate) return;

    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId); // Assuming itemId is the DB id

        if (error) throw error;
      } catch (error: any) {
        console.error('Error updating quantity in DB:', error);
         toast({
            title: "Error",
            description: `Failed to update item quantity in database: ${error.message}`,
            variant: "destructive",
        });
        // return; // Decide if UI should update even if DB fails
      }
    }

    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
    toast({
        title: "Quantity Updated",
        description: `${itemToUpdate.name} quantity set to ${quantity}.`,
    });
  };

  const clearCart = async () => {
     if (user) {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error: any) {
        console.error('Error clearing cart in DB:', error);
        toast({
            title: "Error",
            description: `Failed to clear cart in database: ${error.message}`,
            variant: "destructive",
        });
        // return; // Decide if UI should update even if DB fails
      }
    }
    setItems([]);
    toast({
        title: "Cart Cleared",
        description: "All items removed from cart.",
    });
  };

  // Dummy implementations for coupon/gift card functions
  const applyCoupon = async (couponCode: string) => {
    console.log('Applying coupon:', couponCode);
    // TODO: Implement actual logic, e.g., validate coupon, update state
    // For now, let's assume a dummy coupon
    if (couponCode === "SUMMER20") {
        setAppliedCoupon({ code: couponCode, discountAmount: 20 });
        toast({ title: "Coupon Applied!", description: `${couponCode} applied.`});
    } else {
        toast({ title: "Invalid Coupon", description: `Coupon ${couponCode} not found.`, variant: "destructive"});
    }
  };
  const removeCoupon = async () => {
    console.log('Removing coupon');
    if (appliedCoupon) {
        toast({ title: "Coupon Removed", description: `${appliedCoupon.code} removed.`});
        setAppliedCoupon(null);
    }
  };
  const applyGiftCard = async (giftCardCode: string) => {
    console.log('Applying gift card:', giftCardCode);
    // TODO: Implement actual logic
     if (giftCardCode === "GIFT50") {
        setAppliedGiftCard({ code: giftCardCode, amount: 50 });
        toast({ title: "Gift Card Applied!", description: `${giftCardCode} applied.`});
    } else {
        toast({ title: "Invalid Gift Card", description: `Gift Card ${giftCardCode} not found.`, variant: "destructive"});
    }
  };
  const removeGiftCard = async () => {
    console.log('Removing gift card');
    if (appliedGiftCard) {
        toast({ title: "Gift Card Removed", description: `${appliedGiftCard.code} removed.`});
        setAppliedGiftCard(null);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const discount = appliedCoupon?.discountAmount || 0;
  // Assuming discount is a flat amount for simplicity. If percentage, calculation changes.
  // const discount = appliedCoupon ? (subtotal * (appliedCoupon.discountAmount / 100)) : 0; 
  
  const giftCardAmount = appliedGiftCard?.amount || 0;

  const calculatedTotalPrice = Math.max(0, subtotal - discount - giftCardAmount);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      addItem: addToCart,
      removeFromCart,
      removeItem: removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      totalItems: itemCount,
      subtotal,
      totalPrice: calculatedTotalPrice,
      loading,
      isOpen,
      toggleCart,
      applyCoupon,
      removeCoupon,
      appliedCoupon,
      applyGiftCard,
      removeGiftCard,
      appliedGiftCard,
      giftCardAmount,
      discount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
