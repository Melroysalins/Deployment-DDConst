import { supabase } from 'lib/api';

export const getProjectDetails = async (id) => {
  const res = await supabase.from('projects').select('*').eq('id', id).single();
  return res;
};
export const listAllEvents = async () => {
  const { data: events, error } = await supabase.from('events').select('*');
  if (error) {
    return [];
  }
  return events;
};
export const createNewEvent = async (data) => {
  const res = await supabase.from('events').insert([data]);
  return res;
};

export const editEvent = async (values, id) => {
  const res = await supabase.from('events').update(values).eq('id', id);
  return res;
};

export const deleteEvent = async (id) => {
  const res = await supabase.from('events').delete().eq('id', id);
  return res;
};

export const subscribeEvent = async (handleUpdate) => {
  const events = supabase
    .channel('custom-all-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
      console.log('Change received!', payload);
      handleUpdate();
    })
    .subscribe();
  return events;
};
