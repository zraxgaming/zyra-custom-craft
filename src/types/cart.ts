
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization?: {
    text?: string;
    color?: string;
  };
}
