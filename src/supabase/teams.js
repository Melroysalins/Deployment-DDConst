import { supabase } from 'lib/api'

export const createNewTeam = async (data) => {
	const res = await supabase.from('teams').insert([data])
	return res
}
export const getTeamDetails = async (id) => {
	const res = await supabase.from('teams').select('*').eq('id', id).single()
	return res
}
export const listAllTeams = async () => {
	const res = await supabase.from('teams').select('*')
	return res
}
