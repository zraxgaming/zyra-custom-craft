
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      return (data || []).map(product => ({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        short_description: product.short_description || '',
        price: Number(product.price) || 0,
        category: product.category || '',
        category_id: product.category_id || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        stock_quantity: Number(product.stock_quantity) || 0,
        stock_status: product.stock_status || 'in_stock',
        status: product.status || 'draft',
        in_stock: Boolean(product.in_stock),
        is_featured: Boolean(product.is_featured),
        is_customizable: Boolean(product.is_customizable),
        is_digital: Boolean(product.is_digital),
        is_new: Boolean(product.is_new),
        featured: Boolean(product.featured || product.is_featured),
        slug: product.slug || '',
        images: Array.isArray(product.images) 
          ? (product.images as any[]).map(img => typeof img === 'string' ? img : JSON.stringify(img))
          : [],
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        weight: Number(product.weight) || 0,
        dimensions_length: Number(product.dimensions_length) || 0,
        dimensions_width: Number(product.dimensions_width) || 0,
        dimensions_height: Number(product.dimensions_height) || 0,
        cost_price: Number(product.cost_price) || 0,
        discount_percentage: Number(product.discount_percentage) || 0,
        manage_stock: Boolean(product.manage_stock),
        rating: Number(product.rating) || 0,
        review_count: Number(product.review_count) || 0,
        created_at: product.created_at || '',
        updated_at: product.updated_at || ''
      }));
    },
  });
};
