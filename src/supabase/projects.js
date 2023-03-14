import { supabase } from 'lib/api'

export const createNewProject = async (data) => {
	const res = await supabase.from('projects').insert(data).select()
	return res
}

export const updateProject = async (data, id) => {
	const res = await supabase.from('projects').update(data).eq('id', id).select('*')
	return res
}
export const getProjectDetails = async (id) => {
	const res = await supabase.from('projects').select('*').eq('id', id).single()
	return res
}
export const listAllProjects = async () => {
	const res = await supabase.from('projects').select('*')
	return res
}
export const uploadFile = async (name, file) => {
	const res = await supabase.storage.from('files').update(name, file, {
		cacheControl: '3600',
		upsert: false,
	})
	return res
}

export const getProjectFileLink = async (filename) => {
	try {
		const {
			data: { signedUrl },
			error,
		} = await supabase.storage.from('files').createSignedUrl(filename, 60)
		return error ? null : signedUrl
	} catch (err) {
		return null
	}
}
