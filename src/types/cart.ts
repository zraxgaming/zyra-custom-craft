
export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  images?: string[];
  slug?: string;
  customization?: {
    text?: string;
    position?: string;
    fontSize?: string;
    color?: string;
    imageUrl?: string;
  };
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  subtotal: number;
  itemCount: number;
  isOpen: boolean;
  toggleCart: () => void;
  totalItems: number;
  totalPrice: number;
  removeItem: (productId: string) => void;
}
