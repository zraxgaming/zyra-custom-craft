
export interface UserOrder {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    customization?: any;
    products: {
      id: string;
      name: string;
      images: string[];
    };
  }[];
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
  products: {
    name: string;
    images: string[];
  };
  profiles: {
    display_name: string;
    first_name: string;
    last_name: string;
  };
}
