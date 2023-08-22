import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const addFile = async (name, file, folder) => {
	const res = await supabase.storage.from(folder).upload(name, file, {
		cacheControl: '3600',
		upsert: false,
	})
	if (res?.error && res?.error?.statusCode === '409') {
		const res = await replaceFile(name, file, folder)
		return res
	}
	return res
}
export const replaceFile = async (name, file, folder) => {
	const res = await supabase.storage.from(folder).update(name, file, {
		cacheControl: '3600',
		upsert: false,
	})
	return res
}

export const getFile = async (filename, folder) => {
	try {
		const {
			data: { signedUrl },
			error,
		} = await supabase.storage.from(folder).createSignedUrl(filename, 60)
		return error ? null : signedUrl
	} catch (err) {
		return null
	}
}
