import { supabase } from 'lib/api';

export const getProjectDetails = async (id) => {
  const res = await supabase.from('projects').select('*').eq('id', id).single();
  return res;
};
export const listAllEvents = async () => {
  const res = await supabase.from('events').select('*');
  return res;
};
export const createNewEvent = async (data) => {
  const res = await supabase.from('events').insert([data]);
  return res;
};

export const deleteEvent = async (id) => {
  const res = await supabase.from('events').delete().eq('id', id);
  return res;
};
