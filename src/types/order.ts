
export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Profile {
  id: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  images?: string[];
  description?: string;
  slug?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: ShippingAddress;
  payment_method: string;
  delivery_option: string;
  delivery_type?: string;
  shipping_cost: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  payment_status?: string;
  currency?: string;
  billing_address?: ShippingAddress;
  tracking_number?: string;
  profiles?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization?: any;
  product?: Product;
}

export interface OrderDetail extends Order {
  order_items: OrderItem[];
  profiles: Profile;
}
