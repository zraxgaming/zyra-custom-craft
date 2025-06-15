
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  images: string[];
  category: string;
  category_id?: string;
  in_stock: boolean;
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  discount_percentage?: number;
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  is_featured?: boolean;
  created_at?: string;
  customization_options?: any[];
  categories?: {
    name: string;
    slug: string;
  };
  stock_quantity?: number;
  is_customizable?: boolean;
  is_digital?: boolean;
  sku?: string;
  barcode?: string;
  stock_status?: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map(product => ({
        ...product,
        rating: product.rating || 0,
        review_count: product.review_count || 0,
        is_new: product.is_new || false,
        discount_percentage: product.discount_percentage || 0,
        featured: product.featured || product.is_featured || false,
        is_featured: product.is_featured || product.featured || false,
        images: Array.isArray(product.images) ? product.images : [],
        category: product.categories?.name || product.category || 'Uncategorized',
        category_id: product.category_id,
        is_customizable: product.is_customizable || false,
        is_digital: product.is_digital || false,
        description: product.description || "",
        short_description: product.short_description || "",
        slug: product.slug || product.id,
        in_stock:
          (typeof product.in_stock === "boolean" ? product.in_stock : (product.stock_quantity > 0 && product.stock_status !== 'out_of_stock')),
        stock_status: product.stock_quantity <= 0 ? 'out_of_stock' : (product.stock_status || 'in_stock'),
        created_at: product.created_at,
      })) as Product[];
    },
  });
};
