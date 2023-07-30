import { supabase } from 'lib/api'

export const createApproval = async (data) => {
	const res = await supabase.from('approval').insert(data).select('*')
	return res
}

export const createApprovers = async (data) => {
	const res = await supabase.from('approvers').insert(data)
	return res
}

export const getApprovals = async () => {
	const res = await supabase.from('approval').select(`*, project(id, title)`)
	return res
}

export const getApproversByApproval = async (approval) => {
	const res = await supabase
		.from('approvers')
		.select('*')
		.eq('approval', approval)
		.select(`*, employee(id, name, email_address)`)
	return res
}

export const getApproversDetailByUser = async (user) => {
	const res = await supabase
		.from('approvers')
		.select('*')
		.eq('user', user)
		.select(`*, employee(id, name, email_address), approval(*,  project(id, title))`)
	return res
}

export const getApprovalsByProject = async (projectId) => {
	const res = await supabase.from('approval').select(`*`).eq('project', projectId)
	return res
}

export const deleteApproval = async (id) => {
	const res = await supabase.from('approval').delete().eq('id', id)
	return res
}

export const deleteApprovers = async (id) => {
	const res = await supabase.from('approvers').delete().eq('id', id)
	return res
}

export const updateApproval = async (data, id) => {
	const res = await supabase.from('approval').update(data).eq('id', id).select('*')
	return res
}

export const updateApprovers = async (data, id) => {
	const res = await supabase.from('approvers').update(data).eq('id', id).select('*')
	return res
}
