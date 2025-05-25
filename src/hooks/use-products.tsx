
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
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;

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
        status: product.status || "draft",
        featured: Boolean(product.featured || product.is_featured)
      }));

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
