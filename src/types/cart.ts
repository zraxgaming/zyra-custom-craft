
export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  images?: string[];
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}
