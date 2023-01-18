import { supabase } from 'lib/api'

export const listAllEmployees = async () => {
	const res = await supabase.from('employees').select('*')
	return res
}

export const listEmployeesByProject = async (projectId) => {
	const res = await supabase.from('employees').select('*').eq('project', projectId)
	return res
}
