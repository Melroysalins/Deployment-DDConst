import { supabase } from 'lib/api'

function splitDatesByWeekend(data, project_task) {
	const startDate = new Date(data[0])
	const endDate = new Date(data[1])
	const result = []
	let title = 0
	let needPop = false
	while (startDate <= endDate) {
		// Skip weekends (Saturday and Sunday)
		while ((startDate.getDay() === 0 || startDate.getDay() === 6) && startDate < endDate) {
			startDate.setDate(startDate.getDate() + 1)
		}

		let tempEndDate = new Date(startDate)
		while (tempEndDate.getDay() !== 5 && tempEndDate < endDate) {
			tempEndDate.setDate(tempEndDate.getDate() + 1)
			if (tempEndDate.getDay() === 0) {
				tempEndDate.setDate(tempEndDate.getDate() + 5)
			}
		}

		if (tempEndDate > endDate) {
			tempEndDate = new Date(endDate)
		}

		if (tempEndDate.getDay() !== 0 && tempEndDate.getDay() !== 6) {
			if (needPop) {
				needPop = false
			} else {
				const daysDifference = Math.floor((tempEndDate - startDate) / (1000 * 3600 * 24))
				title += 1
				const formattedTitle = `${title}-${title + daysDifference}`
				title += daysDifference
				result.push({ title: formattedTitle, start: formatDate(startDate), end: formatDate(tempEndDate), project_task })
			}
		}

		if (tempEndDate.getMonth() !== startDate.getMonth()) {
			tempEndDate.setDate(0)
			needPop = true
		}

		startDate.setDate(tempEndDate.getDate() + 1)
		if (startDate.getDay() === 0) {
			startDate.setDate(startDate.getDate() + 1)
		}
	}
	// if (needPop) result.pop()
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
