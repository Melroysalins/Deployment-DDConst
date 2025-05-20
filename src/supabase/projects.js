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
export const addFile = async (name, file) => {
	const res = await supabase.storage.from('files').upload(name, file, {
		cacheControl: '3600',
		upsert: false,
	})
	if (res?.error && res?.error?.statusCode === '409') {
		const res = await replaceFile(name, file)
		return res
	}
	return res
}
export const replaceFile = async (name, file) => {
	const res = await supabase.storage.from('files').update(name, file, {
		cacheControl: '3600',
		upsert: false,
	})
	return res
}
export const removeFile = async (name) => {
	const res = await supabase.storage.from('files').remove([name])
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

export const getSelectedWorkTypes = async (projectId) => {
	const { data, error } = await supabase.from('projects').select('selectedWorkTypes').eq('id', projectId).single()

	if (error) throw error // Handle Supabase errors
	return data // ✅ Return only the data, not the whole response
}
