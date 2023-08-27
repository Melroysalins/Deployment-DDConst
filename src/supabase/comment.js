import { BucketName } from 'constant'
import { supabase } from 'lib/api'
import { getFile } from 'supabaseClient'

export const createComment = async (data) => {
	const res = await supabase.from('comments').insert(data)
	return res
}

export const getCommentsByProjectTask = async (project_task) => {
	const res = await supabase.from('comments').select('*, employee(*)').eq('project_task', project_task)
	const promises = res.data?.map(async (emp) => {
		if (emp.employee.profile) {
			emp.employee.signedUrl = await getFile(emp.employee.profile, BucketName.Profile_Images)
		}
	})
	await Promise.all(promises)
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
	const res = await supabase
		.from('comments')
		.select('*, employee(*), project_task(title, start, end)')
		.eq('approval', approval)
		.order('created_at', { ascending: false })
	// fetch image
	const promises = res.data?.map(async (emp) => {
		if (emp.employee.profile) {
			emp.employee.signedUrl = await getFile(emp.employee.profile, BucketName.Profile_Images)
		}
	})
	await Promise.all(promises)
	return res
}

export const getCommentsByProject = async (project) => {
	const res = await supabase.from('comments').select('*, employee(*)').eq('project', project)
	return res
}
