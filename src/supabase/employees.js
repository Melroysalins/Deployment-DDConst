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

export const getEmployeeOnlyWithHigherTier = async () => {
	const response = await supabase.from('employees').select('*')
	const res = response.data.filter((emp) => {
		return emp?.certificate === 'Special' || emp?.certificate === 'Level 1'
	})

	return res
}

export const getEmployeeOnlyWithLowerTier = async () => {
	const response = await supabase.from('employees').select('*')
	const res = response.data.filter((emp) => {
		return emp?.certificate === 'Level 2' || emp?.certificate === 'Level 3'
	})

	return res
}

export const filterEmployeesWithAvailabilityAndCertificates = async (
	startDate,
	endDate,
	availabilityType, // 'Fully Available' | 'Partially Available' | 'All'
	certificateLimits // e.g. { Special: 2, 'Level 1': 2, 'Level 2': 1 }
) => {
	// 1. Fetch employees
	const { data: employees, error: empError } = await supabase.from('employees').select('id, name, certificate')

	if (empError) {
		console.error(empError)
		return []
	}

	// 2. Fetch events for date range
	const { data: events, error: evError } = await supabase
		.from('events')
		.select('*')
		.eq('type', 'dw')
		.or(`and(start.gte."${startDate}",end.lte."${endDate}"),and(start.lt."${endDate}",end.gt."${startDate}")`)

	if (evError) {
		console.error(evError)
		return []
	}

	const start = new Date(startDate)
	const end = new Date(endDate)

	// 3. Group events by employee
	const eventsByEmployee = events.reduce((acc, event) => {
		if (!acc[event.employee]) acc[event.employee] = []
		acc[event.employee].push(event)
		return acc
	}, {})

	// 4. Mark availability for each employee
	let employeesWithAvailability = employees.map((emp) => {
		const empEvents = eventsByEmployee[emp.id] || []
		const project = eventsByEmployee[emp.id]?.[0]?.project

		const hasOverlap = empEvents.some((event) => {
			const eventStart = new Date(event.start)
			const eventEnd = new Date(event.end)
			return eventEnd >= start && eventStart <= end
		})

		return {
			...emp,
			fullyavailable: !hasOverlap,
			partiallyavailable: hasOverlap,
			events: empEvents,
			project,
		}
	})

	// 5. Filter by availability type
	if (availabilityType === 'Fully Available') {
		employeesWithAvailability = employeesWithAvailability.filter((e) => e.fullyavailable)
	} else if (availabilityType === 'Partially Available') {
		employeesWithAvailability = employeesWithAvailability.filter((e) => e.partiallyavailable)
	} else if (availabilityType === 'All') {
		employeesWithAvailability = employeesWithAvailability.filter((e) => e.fullyavailable || e.partiallyavailable)
	}

	// 6. Apply certificate limits
	const finalResult = []
	Object.entries(certificateLimits).forEach(([certificate, limit]) => {
		if (limit > 0) {
			const matched = employeesWithAvailability.filter((emp) => emp.certificate === certificate)
			finalResult.push(...matched.slice(0, limit))
		}
	})

	return finalResult
}

export const getBranchDetailsAlongWithEmployeesUnderThatBranch = async () => {
	const result = []

	const branchResponse = await supabase.from('branches').select('*')

	const employeeResponse = await supabase.from('employees').select('*')

	branchResponse?.data?.forEach((item) => {
		employeeResponse?.data?.forEach((ele) => {
			if (item?.id === ele?.branch) {
				const existingBranch = result?.find((branch) => branch?.id === item?.id)
				if (existingBranch) {
					existingBranch.employees?.push(ele)
				} else {
					result.push({
						id: item?.id,
						branchName: item?.name,
						employees: [ele],
					})
				}
			}
		})
	})

	return result
}
