import { supabase } from 'lib/api'

export const listAllLogs = async () => {
	const res = await supabase.from('logs').select('*')
	return res
}

export const listAllLogsByProject = async (project) => {
	const res = await supabase
		.from('logs')
		.select('*')
		.eq('project', project)
		.select(
			`
	*,
	employee(id, name)
	`
		)
		.order('id', { ascending: false })
	const changeActionName = (val) => {
		switch (val) {
			case 'INSERT':
				return 'Added'
			case 'UPDATE':
				return 'Updated'
			case 'DELETE':
				return 'Deleted'
			default:
				break
		}
	}

	const promises = res.data.map(async (e) => {
		e.action = changeActionName(e?.action)
	})
	await Promise.all(promises)
	return res
}
