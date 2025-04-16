import { supabase } from 'lib/api'
import { deleteByTaskId } from './nestedTasks'

export const createNewTasks = async (data) => {
	const res = await supabase.from('project_tasks').insert(data)
	return res
}

export const listAllTasks = async () => {
	const res = await supabase.from('project_tasks').select('*')
	return res
}

export const listAllTasksByProject = async (project) => {
	const res = await supabase
		.from('project_tasks')
		.select(
			`*,
              comments (
                *
              ),
			  nested_tasks (*)`
		)
		.eq('project', project)
	return res
}

export const listAllTasksByProject2 = async (project) => {
	const res = await supabase
		.from('project_tasks')
		.select(
			'*'
		)
		.eq('project', project)
	console.log('res', res)
	return res
}

export const listFilteredTasks = async (task_group_id, project) => {
	console.log('task_group_id', task_group_id)
	console.log('project', project)
	const res = await supabase.from('project_tasks').select('*').match({ task_group_id, project })
	console.log('res', res)
	return res
}

export const updateTask = async (data, id) => {
	const { nested_tasks, allDay, comments, overlap, resource, ...rest } = data
	const res = await supabase.from('project_tasks').update(rest).eq('id', id).select()
	return res
}
export const deleteTask = async (id) => {
	await deleteByTaskId(id)
	const res = await supabase.from('project_tasks').delete().eq('id', id)
	return res
}
export const deleteTasks = async (ids) => {
	const res = await supabase.from('project_tasks').delete().in('id', ids)
	return res
}

export const listAllTaskGroups = async () => {
	const res = await supabase.from('task_groups').select('*')
	return res
}
