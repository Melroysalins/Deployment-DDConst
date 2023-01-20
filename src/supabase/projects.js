import { supabase } from 'lib/api'

export const createNewProject = async (data) => {
	const res = await supabase.from('projects').insert(data).select()
	return res
}

export const updateProject = async (data, id) => {
	const res = await supabase.from('projects').update(data).eq('id', id).select('*')
	return res
}
export const getProjectDetails = async (id) => {
	const res = await supabase.from('projects').select('*').eq('id', id).single()
	return res
}
export const listAllProjects = async () => {
	const res = await supabase.from('projects').select('*')
	return res
}
