
export interface CartItem {
  id: string;
  name: string;
  productId: string;
  quantity: number;
  price: number;
  customization?: any;
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
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}
