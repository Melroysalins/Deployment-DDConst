import { BucketName } from 'constant'
import { supabase } from 'lib/api'
import { getFile } from 'supabaseClient'

export const listAllEmployees = async () => {
	const res = await supabase.from('employees').select('*')
	return res
}

export const listEmployeesByProject = async (projectId) => {
	const res = await supabase.from('employees').select('*').eq('project', projectId)
	return res
}

export const getEmployeeDetails = async (id) => {
	const res = await supabase.from('employees').select('*').eq('id', id).single()
	return res
}

export const createEmployee = async (data) => {
	const res = await supabase.from('employees').insert(data).select()
	return res
}

export const updateEmployee = async (data, id) => {
	const res = await supabase.from('employees').update(data).eq('id', id).select('*')
	return res
}

export const deleteEmployee = async (id) => {
	const res = await supabase.from('employees').delete().eq('id', id)
	return res
}

export const listEmployeesWithDetail = async () => {
	const res = await supabase.from('employees').select(`
     *,
    team (
      id, name
    ),
	branch(
		id, name
	)
  `)
	return res
}

export const listEmployeesByTeam = async (team) => {
	const res = await supabase.from('employees').select('*').eq('team', team).select(`
     id, name
  `)
	return res?.data
}

export const getEmployeeByUser = async (user) => {
	const res = await supabase.from('employees').select('*').eq('user', user).single()
	return res
}

export const getEmployeeBasedOnCertificate = async (
	certificate,
	limit,
	filterProjectLeads = false,
	projectLeadCertificate = []
) => {
	// Base query
	const res = await supabase.from('employees').select('*').eq('certificate', certificate).limit(limit)

	if (filterProjectLeads && res.data) {
		res.data = res.data.filter((emp) => {
			if (emp.team_lead) {
				return projectLeadCertificate.includes(emp.certificate)
			}
			return true
		})
	}

	return res
}

export const filterEmployees = async (projectLeadCertificate) => {
	const res = await supabase.from('employees').select('*')

	res.data = res.data.filter((emp) => {
		if (emp.team_lead) {
			return projectLeadCertificate.includes(emp.certificate)
		}
		return true
	})

	return res
}
