import { supabase } from 'lib/api'

export const createNewBranch = async (data) => {
	const res = await supabase.from('branches').insert([data])
	return res
}
export const getBranchDetails = async (id) => {
	const res = await supabase.from('branches').select('*').eq('id', id).single()
	return res
}
export const listAllBranches = async () => {
	const res = await supabase.from('branches').select('*')
	return res
}
