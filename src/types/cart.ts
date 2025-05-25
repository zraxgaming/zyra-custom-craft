
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  customization: Record<string, any>;
  image?: string;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
}

export interface CartState {
  isOpen: boolean;
  items: CartItem[];
}

export interface CartContextType {
  state: CartState;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "id">) => Promise<void>;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}
