
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  images: string[];
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  is_customizable?: boolean;
  discount_percentage?: number;
  in_stock: boolean;
  stock_quantity?: number;
  category?: string;
  is_featured?: boolean;
  status?: string;
  sku?: string;
  is_digital?: boolean;
  featured?: boolean;
  created_at?: string;
}

export interface CustomizationOptions {
  id: string;
  allowText: boolean;
  allowImage: boolean;
  maxTextLength: number;
  maxImageCount: number;
  allowResizeRotate: boolean;
}

export interface ProductWithImages extends Product {
  product_images?: Array<{
    id: string;
    image_url: string;
    alt_text?: string;
    is_primary: boolean;
    sort_order: number;
  }>;
}
