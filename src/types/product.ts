
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  stock_quantity?: number;
  manage_stock?: boolean;
  stock_status?: string;
  weight?: number;
  dimensions_length?: number;
  dimensions_width?: number;
  dimensions_height?: number;
  category_id?: string;
  category?: string;
  is_customizable?: boolean;
  is_digital?: boolean;
  is_featured?: boolean;
  featured?: boolean;
  status?: string;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
  discount_percentage?: number;
  images: string[];
  image_url?: string;
  is_new?: boolean;
  in_stock?: boolean;
  rating?: number;
  review_count?: number;
  customization_options?: {
    allow_text?: boolean;
    allow_image?: boolean;
    max_text_length?: number;
    max_image_count?: number;
    allow_resize_rotate?: boolean;
  };
}

export interface ProductFilters {
  category?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'created_at' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  customization?: {
    text?: string;
    images?: string[];
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    rotation?: number;
  };
}
