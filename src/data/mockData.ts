
import { supabase } from '../integrations/supabase/client';

export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching products:', err);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching categories from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching categories:', err);
    return [];
  }
};

export const fetchOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles (
          display_name,
          email,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching orders:', err);
    return [];
  }
};
