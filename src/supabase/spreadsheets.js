import { supabase } from 'lib/api'

export const createNewSpreadsheet = async (data) => {
	const res = await supabase.from('spreadsheets').insert(data).select()
	return res
}

export const updateSpreadsheet = async (data, id) => {
	const res = await supabase.from('spreadsheets').update(data).eq('id', id).select('*')
	return res
}

export const getSpreadsheet = async (id) => {
	const res = await supabase.from('spreadsheets').select('*').eq('id', id).single()
	return res
}

export const getSpreadsheetByProject = async (project) => {
	const res = await supabase.from('spreadsheets').select('*').eq('project', project).single()
	return res
}
