
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  cost_price?: number;
  discount_percentage: number;
  rating: number;
  review_count: number;
  images: string[];
  category: string;
  category_id?: string;
  featured: boolean;
  is_featured?: boolean;
  is_new: boolean;
  in_stock: boolean;
  stock_quantity?: number;
  stock_status?: string;
  status?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions_length?: number;
  dimensions_width?: number;
  dimensions_height?: number;
  is_customizable?: boolean;
  is_digital?: boolean;
  manage_stock?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
  categories?: {
    name: string;
    slug: string;
  };
  customization_options?: Array<{
    id: string;
    allow_text: boolean;
    allow_image: boolean;
    max_text_length: number;
    max_image_count: number;
    allow_resize_rotate: boolean;
  }>;
}

export interface CartItem {
  productId: string;
  quantity: number;
  customization: {
    text?: string;
    image?: string;
    position?: {
      x: number;
      y: number;
    };
    scale?: number;
    rotation?: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  icon?: string;
}
