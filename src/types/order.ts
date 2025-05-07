
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
  customization?: any;
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
