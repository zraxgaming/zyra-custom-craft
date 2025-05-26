
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  cost_price?: number;
  images: string[];
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  is_customizable?: boolean;
  discount_percentage?: number;
  in_stock: boolean;
  stock_quantity?: number;
  category?: string;
  category_id?: string;
  is_featured?: boolean;
  status?: string;
  sku?: string;
  barcode?: string;
  brand?: string;
  is_digital?: boolean;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  meta_title?: string;
  meta_description?: string;
  manage_stock?: boolean;
  weight?: number;
  dimensions_length?: number;
  dimensions_width?: number;
  dimensions_height?: number;
  stock_status?: string;
}
