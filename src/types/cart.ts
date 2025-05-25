
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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
  items: CartItem[];
  isOpen: boolean;
}
