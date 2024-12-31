import { supabase } from 'lib/api'

export const createProfile = async (data) => {
	const res = await supabase.from('profiles').insert(data).select('*')
	return res
}