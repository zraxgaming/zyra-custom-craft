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
  quantity: number;
  price: number;
  product: {
    name: string;
    images?: string[];
  };
  customization: Record<string, any> | null;
}

export interface Order {
  id: string;
  user_id?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  payment_method: string;
  total_amount: number;
  delivery_type: string;
  shipping_address: ShippingAddress | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  start_date: string;
  end_date?: string | null;
  active: boolean;
  placement: string;
  created_at: string;
  updated_at: string;
}
