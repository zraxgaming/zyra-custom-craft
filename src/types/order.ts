
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  currency?: string;
  shipping_address?: any;
  billing_address?: any;
  delivery_type?: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  profile_id?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization?: any;
  created_at?: string;
}
