
export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization?: any;
  product?: {
    id: string;
    name: string;
    images?: string[];
  };
}

export interface Order {
  id: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_method: string;
  total_amount: number;
  currency: string;
  delivery_type: string;
  shipping_address?: ShippingAddress;
  billing_address?: ShippingAddress;
  notes?: string;
  tracking_number?: string;
  order_items?: OrderItem[];
  profiles?: {
    display_name?: string;
    email?: string;
  };
}

export interface OrderDetail extends Order {
  currency: string;
  tracking_number?: string;
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
