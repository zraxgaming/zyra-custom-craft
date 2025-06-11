
export interface CartItem {
  id: string;
  product_id: string;
  user_id?: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  images?: string[];
  customization?: {
    text?: string;
    images?: string[];
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    rotation?: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  subtotal: number;
  loading: boolean;
}
