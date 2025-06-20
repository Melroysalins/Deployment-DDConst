import { supabase } from 'lib/api'

/**
 * Creates a new task dependency in the database.
 *
 * @param {Object} param - The parameters for creating the task dependency.
 * @param {string} param.from_task_id - The ID of the task that is the source of the dependency.
 * @param {string} param.to_task_id - The ID of the task that is the target of the dependency.
 * @param {string} param.project_id - The ID of the project to which the tasks belong.
 * @returns {Promise<Object>} A promise that resolves to the newly created task dependency.
 */

export const createTaskDependency = async ({
	from_task_id,
	to_task_id,
	project_id,
	type,
	lag,
	lag_unit,
	active = true,
}) => {
	const res = await supabase
		.from('tasks_dependency')
		.insert({ from_task_id, to_task_id, project_id, type, lag, lagUnit: lag_unit, active })
		.select()
	return res
}

/**
 * Updates a task dependency in the database.
 *
 * @param {Object} param - The parameters for updating the task dependency.
 * @param {string} param.to_task_id - The ID of the task that is the target of the dependency.
 * @param {string} param.id - The ID of the task dependency to update.
 * @returns {Promise<Object>} A promise that resolves to the updated task dependency.
 */

// export const updateTaskDependency = async ({ to_task_id, id }) => {
// 	const res = await supabase.from('tasks_dependency').update({ to_task_id }).eq('id', id).select('*')
// 	return res
// }

/**
 * Gets a task dependency from the database.
 *
 * @param {string} id - The ID of the task dependency to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the task dependency.
 */
export const getTaskDependency = async (id) => {
	const res = await supabase.from('tasks_dependency').select('*').eq('id', id).single()
	return res
}

/**
 * Retrieves a task dependency associated with a specific project.
 *
 * @param {string} project - The ID of the project to retrieve the task dependency for.
 * @returns {Promise<Object>} A promise that resolves to the task dependency associated with the specified project.
 */

/**
 * Retrieves all task dependencies associated with a specific project.
 *
 * @param {string} project - The ID of the project to retrieve the task dependencies for.
 * @returns {Promise<Object>} A promise that resolves to the task dependencies associated with the specified project.
 */
export const getAllTaskDependencyByProject = async (project) => {
	const res = await supabase.from('tasks_dependency').select('*').eq('project_id', project)
	return res
}

/**
 * Deletes a task dependency from the database.
 *
 * @param {string} id - The ID of the task dependency to delete.
 * @returns {Promise<Object>} A promise that resolves to the deleted task dependency.
 */
export const deleteTaskDependency = async (id) => {
	const res = await supabase.from('tasks_dependency').delete().eq('id', id)
	return res
}

export const updateTaskDependency = async (params) => {
	const { id, ...fields } = params
	const res = await supabase.from('tasks_dependency').update(fields).eq('id', id).select()
	return res
}
