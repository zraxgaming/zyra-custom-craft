
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { WishlistItem } from "@/types/wishlist";

export const useWishlist = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlistItems = async () => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      if (error) throw error;
      await fetchWishlistItems();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
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
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [user]);

  return {
    items,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refetch: fetchWishlistItems
  };
};
