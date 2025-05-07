
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  name: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
  };
  customization?: Record<string, any> | null;
}

export interface OrderDetail {
  id: string;
  created_at: string;
  updated_at: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  delivery_type: string;
  shipping_address: ShippingAddress | null;
  user_id: string | null;
  profiles: {
    display_name: string;
    email: string;
  } | null;
  order_items: OrderItem[];
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  link?: string;
  active: boolean;
  placement: string;
  start_date: string;
  end_date?: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_uses?: number;
  used_count: number;
  active: boolean;
  starts_at: string;
  expires_at?: string;
  created_at: string;
}
