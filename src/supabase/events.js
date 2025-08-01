import { supabase } from 'lib/api'

// export const getProjectDetails = async (id) => {
//   const res = await supabase.from('projects').select('*').eq('id', id).single();
//   return res;
// };
export const listAllEvents = async (filters) => {
	let filter = Object.keys(filters).map((itm) => `type.eq.${itm}`)
	filter = filter.join(',')
	const { data: events, error } = await supabase.from('events').select('*').or(filter)
	if (error) {
		return []
	}
	return events
}
export const listSelectedEvents = async (filters, project) => {
	let filter = Object.keys(filters).map((itm) => `type.eq.${itm}`)
	filter = filter.join(',')
	const { data: events, error } = await supabase.from('events').select('*').or(filter).eq('project', project)
	if (error) {
		return []
	}
	return events
}
export const createNewEvent = async (data) => {
	const res = await supabase.from('events').insert([data])
	return res
}

export const editEvent = async (values, id) => {
	const res = await supabase.from('events').update(values).eq('id', id)
	return res
}

export const deleteEvent = async (id) => {
	const res = await supabase.from('events').delete().eq('id', id)
	return res
}

export const subscribeEvent = async (handleUpdate) => {
	const events = supabase
		.channel('custom-all-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
			handleUpdate()
		})
		.subscribe()
	return events
}
