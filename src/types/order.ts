
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization?: any;
  created_at: string;
  product?: {
    id: string;
    name: string;
    images?: string[];
    image_url?: string;
  };
}

export interface Order {
  id: string;
  user_id: string;
  profile_id?: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  currency?: string;
  delivery_type?: string;
  tracking_number?: string;
  notes?: string;
  shipping_address?: any;
  billing_address?: any;
  created_at: string;
  updated_at?: string;
  profiles?: {
    id: string;
    email?: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
  };
}

export interface OrderDetail extends Order {
  order_items: OrderItem[];
}
