
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface WishlistItem {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  rating?: number;
  review_count?: number;
}

export const useWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          created_at,
          products (
            id,
            name,
            slug,
            price,
            images,
            rating,
            review_count
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const transformedItems: WishlistItem[] = (data || []).map(item => ({
        id: item.id,
        user_id: user.id,
        product_id: item.product_id,
        created_at: item.created_at,
        name: item.products?.name || '',
        slug: item.products?.slug || '',
        price: item.products?.price || 0,
        images: Array.isArray(item.products?.images) 
          ? (item.products.images as string[]).filter(img => typeof img === 'string')
          : [],
        rating: item.products?.rating,
        review_count: item.products?.review_count
      }));

      setItems(transformedItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;

      await fetchWishlistItems();
      toast({
        title: "Added to Wishlist",
        description: "Item has been added to your wishlist"
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive"
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      await fetchWishlistItems();
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist"
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading
  };
};
