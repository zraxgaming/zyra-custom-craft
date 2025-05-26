
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
  status?: string;
  weight?: number;
  dimensions_length?: number;
  dimensions_width?: number;
  dimensions_height?: number;
  category?: string;
  category_id?: string;
  images: string[];
  is_customizable?: boolean;
  is_digital?: boolean;
  is_featured?: boolean;
  featured?: boolean;
  is_new?: boolean;
  in_stock?: boolean;
  rating?: number;
  review_count?: number;
  meta_title?: string;
  meta_description?: string;
  discount_percentage?: number;
  created_at?: string;
  updated_at?: string;
}
