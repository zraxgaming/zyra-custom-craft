
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  shipping_address?: any;
  billing_address?: any;
  currency: string;
  delivery_type: string;
  notes?: string;
  tracking_number?: string;
  created_at: string;
  updated_at?: string;
  profiles?: {
    email: string;
    first_name: string;
    last_name: string;
  };
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization?: any;
  created_at: string;
}
