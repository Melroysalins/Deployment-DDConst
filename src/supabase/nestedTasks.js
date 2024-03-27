import { supabase } from 'lib/api'

function splitDatesByWeekend(data, project_task) {
	const startDate = new Date(data[0])
	const endDate = new Date(data[1])
	const result = []
	let title = 0
	while (startDate <= endDate) {
		// Skip weekends (Saturday and Sunday)
		while (startDate.getDay() === 0 || startDate.getDay() === 6) {
			startDate.setDate(startDate.getDate() + 1)
		}

		const tempEndDate = new Date(startDate)
		// Move tempEndDate to the next Friday or endDate, whichever comes first
		while (tempEndDate.getDay() !== 5 && tempEndDate < endDate) {
			tempEndDate.setDate(tempEndDate.getDate() + 1)
			if (tempEndDate.getDay() === 0) {
				tempEndDate.setDate(tempEndDate.getDate() + 5) // Move to next Friday
			}
		}

		const daysDifference = (tempEndDate - startDate) / (1000 * 3600 * 24) // Difference in days
		const formattedTitle = `${title + 1}-${title + daysDifference}` // Adding 1 to include both start and end dates
		title += daysDifference + 1
		result.push({ title: formattedTitle, start: formatDate(startDate), end: formatDate(tempEndDate), project_task })

		// Move startDate to the next Monday or the day after tempEndDate, whichever comes first
		startDate.setDate(tempEndDate.getDate() + 1)
		if (startDate.getDay() === 0) {
			startDate.setDate(startDate.getDate() + 1) // Move to next Monday
		}
	}
	return result
}

function formatDate(date) {
	return date.toISOString().split('T')[0]
}

export const updateNestedTasks = async (data, project_task) => {
	const arr = splitDatesByWeekend(data, project_task)
	// delete all and insert new tasks
	await deleteByTaskId(project_task)
	const res = await supabase.from('nested_tasks').insert(arr).select()
	return res
}

export const listAllNestedTasksByProject = async (project) => {
	const res = await supabase.from('nested_tasks').select(`*`).eq('project', project)
	return res
}

export const listAllNestedTask = async () => {
	const res = await supabase.from('nested_tasks').select('*')
	return res
}

export const deleteByTaskId = async (project_task) => {
	const res = await supabase.from('nested_tasks').delete().eq('project_task', project_task)
	return res
}
