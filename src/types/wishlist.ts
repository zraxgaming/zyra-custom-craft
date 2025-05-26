
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  rating?: number;
  review_count?: number;
}
