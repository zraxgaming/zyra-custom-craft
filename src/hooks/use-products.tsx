
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  slug: string;
  in_stock: boolean;
  rating: number;
  review_count: number;
  is_new: boolean;
  discount_percentage: number;
  stock_quantity?: number;
  status: string;
  featured: boolean;
  sku?: string;
  barcode?: string;
  category_id?: string;
  short_description?: string;
  cost_price?: number;
  weight?: number;
  dimensions_length?: number;
  dimensions_width?: number;
  dimensions_height?: number;
  is_customizable?: boolean;
  is_digital?: boolean;
  manage_stock?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching products...");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Raw products data:", data);

      const formattedProducts: Product[] = (data || []).map((product: any) => ({
        id: product.id,
        name: product.name || "Unnamed Product",
        description: product.description || "",
        price: Number(product.price) || 0,
        images: Array.isArray(product.images) ? product.images : [],
        category: product.category || "Uncategorized",
        slug: product.slug || product.id,
        in_stock: Boolean(product.in_stock),
        rating: Number(product.rating) || 0,
        review_count: Number(product.review_count) || 0,
        is_new: Boolean(product.is_new),
        discount_percentage: Number(product.discount_percentage) || 0,
        stock_quantity: product.stock_quantity,
        status: product.status || "published",
        featured: Boolean(product.featured || product.is_featured),
        sku: product.sku,
        barcode: product.barcode,
        category_id: product.category_id,
        short_description: product.short_description,
        cost_price: product.cost_price,
        weight: product.weight,
        dimensions_length: product.dimensions_length,
        dimensions_width: product.dimensions_width,
        dimensions_height: product.dimensions_height,
        is_customizable: product.is_customizable,
        is_digital: product.is_digital,
        manage_stock: product.manage_stock,
        meta_title: product.meta_title,
        meta_description: product.meta_description,
        created_at: product.created_at,
        updated_at: product.updated_at
      }));

      console.log("Formatted products:", formattedProducts);
      setProducts(formattedProducts);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setError(error.message);
      toast({
        title: "Error loading products",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts
  };
};
