
export interface CartItem {
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
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number, customization?: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getTotalItems: () => number;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    slug: string;
  };
}
