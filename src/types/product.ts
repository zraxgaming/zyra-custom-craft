
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  images: string[];
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  is_customizable?: boolean;
  stock_quantity?: number;
  in_stock?: boolean;
  category?: string;
  featured?: boolean;
  is_new?: boolean;
  category_id?: string;
  barcode?: string;
  cost_price?: number;
  created_at?: string;
  updated_at?: string;
  dimensions_height?: number;
  dimensions_length?: number;
  dimensions_width?: number;
  discount_percentage?: number;
  is_digital?: boolean;
  manage_stock?: boolean;
  meta_description?: string;
  meta_title?: string;
  short_description?: string;
  sku?: string;
  status?: string;
  stock_status?: string;
  weight?: number;
}
