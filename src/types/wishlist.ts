
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  name: string;
  price: number;
  images: string[]; // Should be string array
  slug: string; 
  rating?: number; 
  review_count?: number; 
}

