
import { supabase } from "@/integrations/supabase/client";

export const executeSql = async (sql: string) => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('SQL execution error:', error);
    throw error;
  }
};

export const insertShippingMethod = async (method: {
  name: string;
  description: string;
  price: number;
  active: boolean;
  estimated_days: string;
}) => {
  const { data, error } = await supabase
    .from('shipping_methods')
    .insert(method)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateShippingMethod = async (id: string, method: {
  name: string;
  description: string;
  price: number;
  active: boolean;
  estimated_days: string;
}) => {
  const { data, error } = await supabase
    .from('shipping_methods')
    .update(method)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteShippingMethod = async (id: string) => {
  const { error } = await supabase
    .from('shipping_methods')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

export const getShippingMethods = async () => {
  const { data, error } = await supabase
    .from('shipping_methods')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};
