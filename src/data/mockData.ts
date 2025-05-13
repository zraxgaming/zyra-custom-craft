
import { supabase } from '../integrations/supabase/client';

export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return [];
    }

    return data;
  } catch (err) {
    console.error('Unexpected error fetching products:', err);
    return [];
  }
};
