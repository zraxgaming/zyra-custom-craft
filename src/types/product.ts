
export interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  category?: string;
  category_id?: string;
  sku?: string;
  barcode?: string;
  stock_quantity?: number;
  stock_status?: string;
  status?: string;
  in_stock?: boolean;
  is_featured?: boolean;
  is_customizable?: boolean;
  is_digital?: boolean;
  is_new?: boolean;
  featured?: boolean;
  slug?: string;
  images: string[];
  meta_title?: string;
  meta_description?: string;
  weight?: number;
  dimensions_length?: number;
  dimensions_width?: number;
  dimensions_height?: number;
  cost_price?: number;
  discount_percentage?: number;
  manage_stock?: boolean;
  rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Export a type that ensures images is always defined for components that require it
export interface ProductWithImages extends Product {
  images: string[];
}
