import { supabase } from 'lib/api'
import { listEmployeesByTeam, updateEmployee } from './employees'

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

export const updateTeam = async (data, id) => {
	const res = await supabase.from('teams').update(data).eq('id', id).select('*')
	return res
}

export const deleteTeam = async (id) => {
	const res = await supabase.from('teams').delete().eq('id', id)
	return res
}

export const listTeamDetailsWithEmp = async () => {
	const res = await supabase.from('teams').select(`
     *,
	branch(
		id, name
	),
	project(
		id, title
	)
  `)
	const promises = res.data?.map(async (t) => {
		const emp = await listEmployeesByTeam(t.id)
		if (emp.length > 0) {
			t.employees = emp.map((e) => e.name).toString()
		}
	})
	await Promise.all(promises)
	return res
}

export const getTeamDetailsWithEmp = async (id) => {
	const res = await supabase
		.from('teams')
		.select(
			`*,
			branch(
				id, name
			),
			project(
				id, title
			)`
		)
		.eq('id', id)
		.single()

	const _empolyees = await listEmployeesByTeam(res.data?.id)
	res.data.employees = _empolyees.map((e) => e.id)
	return res
}

export const createTeamWithEmp = async (data) => {
	const { employees, ...rest } = data
	const res = await supabase.from('teams').insert(rest).select('*')
	const promises = employees.map(async (id) => {
		await updateEmployee({ team: res.data[0]?.id }, id)
	})
	await Promise.all(promises)
	return res
}

export const updateTeamWithEmp = async (data, id) => {
	const { employees, ...rest } = data
	await supabase.from('employees').update({ team: null }).eq('team', id).select('*')
	const res = await supabase.from('teams').update(rest).eq('id', id).select('*')
	const promises = employees.map(async (id) => {
		await updateEmployee({ team: res.data[0]?.id }, id)
	})
	await Promise.all(promises)
	return res
}
