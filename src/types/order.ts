
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
