import { supabase } from 'lib/api'

export const createComment = async (data) => {
	const res = await supabase.from('comments').insert(data)
	return res
}

export const getCommentsByProjectTask = async (project_task) => {
	const res = await supabase.from('comments').select('*, employee(*)').eq('project_task', project_task)
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

export const getCommentsByApproval = async (approval) => {
	const res = await supabase.from('comments').select('*, employee(*), project_task(title)').eq('approval', approval)

	return res
}

export const getCommentsByProject = async (project) => {
	const res = await supabase.from('comments').select('*, employee(*)').eq('project', project)
	return res
}
