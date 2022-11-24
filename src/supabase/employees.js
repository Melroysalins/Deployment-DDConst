import { supabase } from 'lib/api';

export const listAllEmployees = async () => {
  const res = await supabase.from('employees').select('*');
  return res;
};
