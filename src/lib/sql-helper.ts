
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
  const sql = `
    INSERT INTO shipping_methods (name, description, price, active, estimated_days) 
    VALUES ('${method.name}', '${method.description}', ${method.price}, ${method.active}, '${method.estimated_days}')
    RETURNING *
  `;
  
  return executeSql(sql);
};

export const updateShippingMethod = async (id: string, method: {
  name: string;
  description: string;
  price: number;
  active: boolean;
  estimated_days: string;
}) => {
  const sql = `
    UPDATE shipping_methods SET 
      name = '${method.name}',
      description = '${method.description}',
      price = ${method.price},
      active = ${method.active},
      estimated_days = '${method.estimated_days}'
    WHERE id = '${id}'
    RETURNING *
  `;
  
  return executeSql(sql);
};

export const deleteShippingMethod = async (id: string) => {
  const sql = `DELETE FROM shipping_methods WHERE id = '${id}'`;
  return executeSql(sql);
};

export const getShippingMethods = async () => {
  const sql = `SELECT * FROM shipping_methods ORDER BY created_at ASC`;
  return executeSql(sql);
};
