
export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
  customization?: {
    text?: string;
    color?: string;
    images?: string[];
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    rotation?: number;
  };
}
