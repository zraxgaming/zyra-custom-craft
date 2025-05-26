
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
  profiles?: {
    id: string;
    email?: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
  };
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization?: any;
  created_at?: string;
  product?: {
    id: string;
    name: string;
    images?: string[];
    image_url?: string;
  };
}

export interface OrderDetail extends Order {
  order_items?: OrderItem[];
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: string;
  reward_earned: boolean;
  created_at: string;
  updated_at: string;
  referred_profiles?: {
    display_name?: string;
    email?: string;
  };
}
