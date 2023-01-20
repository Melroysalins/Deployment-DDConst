import { supabase } from 'lib/api'

export const createNewTasks = async (data) => {
	const res = await supabase.from('project_tasks').insert(data)
	return res
}

export const listAllTasks = async () => {
	const res = await supabase.from('project_tasks').select('*')
	return res
}

export const listFilteredTasks = async (task_group, project) => {
	const res = await supabase.from('project_tasks').select('*').match({ task_group, project })
	console.log(res)
	return res
}

export const updateTask = async (data, id) => {
	console.log(data, id)
	const res = await supabase.from('project_tasks').update(data).eq('id', id).select()
	return res
}
export const deleteTask = async (id) => {
	const res = await supabase.from('project_tasks').delete().eq('id', id)
	return res
}
export const deleteTasks = async (ids) => {
	const res = await supabase.from('project_tasks').delete().in('id', ids)
	return res
}
