import { supabase } from 'lib/api'

export const createComment = async (data) => {
	const res = await supabase.from('comments').insert(data)
	return res
}

export const getCommentsByProjectTask = async (project_task) => {
	const res = await supabase.from('comments').select('*').eq('project_task', project_task).select(`*`)
	return res
}

export const deleteComment = async (id) => {
	const res = await supabase.from('comments').delete().eq('id', id)
	return res
}

export const updateComment = async (data, id) => {
	const res = await supabase.from('comments').update(data).eq('id', id).select('*')
	return res
}
