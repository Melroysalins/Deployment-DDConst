import { supabase } from 'lib/api'
import { deleteByTaskId } from './nestedTasks'

export const createNewTasks = async (data) => {
	const res = await supabase.from('project_tasks').insert(data).select()
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
	const res = await supabase.from('project_tasks').select('*').eq('project', project)
	console.log('res', res)
	return res
}

export const listFilteredTasks = async (task_group_id, project) => {
	const res = await supabase
		.from('project_tasks')
		.select('*')
		.match({ task_group_id, project })
		.order('tl', { ascending: true })
		.order('priority', { ascending: true })
		.order('start_date', { ascending: true })
		.order('end_date', { ascending: true })

	return res
}

export const updateTask = async (data, id) => {
	const { nested_tasks, allDay, comments, overlap, resource, ...rest } = data
	const res = await supabase.from('project_tasks').update(rest).eq('id', id).select()
	console.log('update', res)
	console.log('Updating task ID:', id)
	console.log('Payload:', rest, res)
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

export const listTaskThatHasSubTasks = async (project) => {
	const res = await supabase.from('project_tasks').select('id, parent_task').match({ project })

	if (res.error) {
		console.error('Error !! while fetching the paren tasks')

		return []
	}
	const tasks = res.data

	const parentIds = tasks.map((task) => task.parent_task).filter((id) => id !== null)

	const uniqueParentIds = [...new Set(parentIds)]

	return uniqueParentIds
}
