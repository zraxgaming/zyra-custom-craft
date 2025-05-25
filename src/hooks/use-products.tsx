
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  in_stock: boolean;
  rating: number;
  review_count: number;
  is_new: boolean;
  discount_percentage: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  created_at: string;
  customization_options?: any[];
  categories?: {
    name: string;
    slug: string;
  };
  stock_quantity?: number;
  is_customizable: boolean;
  is_digital: boolean;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(product => ({
        ...product,
        rating: product.rating || 0,
        review_count: product.review_count || 0,
        is_new: product.is_new || false,
        discount_percentage: product.discount_percentage || 0,
        featured: product.featured || false,
        images: Array.isArray(product.images) ? product.images : [],
        category: product.categories?.name || product.category || 'Uncategorized',
        is_customizable: product.is_customizable || false,
        is_digital: product.is_digital || false
      })) as Product[];
    },
  });
};
