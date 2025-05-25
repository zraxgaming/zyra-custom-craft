
export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    slug: string;
  };
  quantity: number;
  customization?: any;
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
