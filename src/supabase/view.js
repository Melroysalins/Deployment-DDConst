import { supabase } from 'lib/api'

export const listAllViews = async () => {
	const res = await supabase.from('views').select('*')
	return res
}

export const getViewDetails = async (id) => {
	const res = await supabase.from('views').select('*').eq('id', id).single()
	return res
}

export const createView = async (data) => {
	const res = await supabase.from('views').insert(data).select().single()
	return res
}

export const updateView = async (data, id) => {
	const res = await supabase.from('views').update(data).eq('id', id).select().single()
	return res
}

export const deleteView = async (id) => {
	const res = await supabase.from('views').delete().eq('id', id)
	return res
}

export const listAllViewsByEmp = async (empId) => {
	const res = await supabase.from('views').select('*').eq('employee', empId)
	return res
}
