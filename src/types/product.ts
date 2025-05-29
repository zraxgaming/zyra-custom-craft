
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
  images: string[];
  category?: string;
  category_id?: string;
  stock_quantity?: number;
  stock_status?: string;
  status?: string;
  is_featured?: boolean;
  is_customizable?: boolean;
  is_digital?: boolean;
  is_new?: boolean;
  featured?: boolean;
  in_stock?: boolean;
  manage_stock?: boolean;
  weight?: number;
  dimensions_length?: number;
  dimensions_width?: number;
  dimensions_height?: number;
  meta_title?: string;
  meta_description?: string;
  rating?: number;
  review_count?: number;
  discount_percentage?: number;
  created_at?: string;
  updated_at?: string;
  customization_options?: any;
  is_published?: boolean;
}
