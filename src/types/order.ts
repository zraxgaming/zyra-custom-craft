
export interface Order {
  id: string;
  user_id: string;
  profile_id?: string;
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
    display_name?: string;
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
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
}

export interface OrderDetail extends Order {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  profiles?: {
    email: string;
    first_name: string;
    last_name: string;
    display_name?: string;
  } | null;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
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
  updated_at: string;
}
