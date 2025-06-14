
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  name: string;
  slug: string; // Added
  price: number;
  images: string[];
  rating?: number; // Added
  review_count?: number; // Added
}

