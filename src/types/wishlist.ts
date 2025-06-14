
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  name: string;
  price: number;
  images: string[];
  slug: string; // Added
  rating?: number; // Added
  review_count?: number; // Added
}
