
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  parent_id?: string;
  icon?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const useCategories = () => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      setData(categories || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { data, isLoading, error, refetch };
};
