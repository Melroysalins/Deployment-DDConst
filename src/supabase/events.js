import { supabase } from 'lib/api'

// export const getProjectDetails = async (id) => {
//   const res = await supabase.from('projects').select('*').eq('id', id).single();
//   return res;
// };
export const listAllEvents = async (filters) => {
	let filter = Object.keys(filters).map((itm) => `type.eq.${itm}`)
	filter = filter.join(',')
	const { data: events, error } = await supabase.from('events').select('*').or(filter)
	if (error) {
		return []
	}
	return events
}
export const listSelectedEvents = async (filters, project) => {
	let filter = Object.keys(filters).map((itm) => `type.eq.${itm}`)
	filter = filter.join(',')
	const { data: events, error } = await supabase.from('events').select('*').or(filter).eq('project', project)
	if (error) {
		return []
	}
	return events
}
export const createNewEvent = async (data) => {
	const res = await supabase.from('events').insert([data])
	return res
}

export const editEvent = async (values, id) => {
	const res = await supabase.from('events').update(values).eq('id', id)
	return res
}

export const deleteEvent = async (id) => {
	const res = await supabase.from('events').delete().eq('id', id)
	return res
}

export const subscribeEvent = async (handleUpdate) => {
	const events = supabase
		.channel('custom-all-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
			handleUpdate()
		})
		.subscribe()
	return events
}

export const listEventsToCheckAvailability = async (startDate, endDate, availability) => {
	const { data: employees, error: empError } = await supabase
		.from('employees')
		.select('id, name , certificate , branch')

	if (empError) {
		console.error(empError)
		return []
	}

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

	// Step 3: Group events by employee
	const eventsByEmployee = events.reduce((acc, event) => {
		if (!acc[event.employee]) acc[event.employee] = []
		acc[event.employee].push(event)
		return acc
	}, {})

	// Step 4: Build result for every employee
	let result = employees.map((emp) => {
		const empEvents = eventsByEmployee[emp.id] || []

		// Check if they have any events overlapping with the range
		let hasOverlap = false
		empEvents.forEach((event) => {
			const eventStart = new Date(event.start)
			const eventEnd = new Date(event.end)
			if (eventEnd >= start && eventStart <= end) {
				hasOverlap = true
			}
		})

		const fullyavailable = !hasOverlap
		const partiallyavailable = hasOverlap

		return {
			employee: emp.id,
			name: emp.name,
			fullyavailable: fullyavailable || undefined,
			partiallyavailable: partiallyavailable || undefined,
			events: empEvents, // keep as-is, even if empty
			certificate: emp?.certificate,
			branch: emp?.branch,
		}
	})

	// Step 5: Filter based on availability
	if (availability === 'Fully Available') {
		result = result.filter((r) => r.fullyavailable)
	} else if (availability === 'Partially Available') {
		result = result.filter((r) => r.partiallyavailable)
	} else if (availability === 'All') {
		result = result.filter((r) => r.partiallyavailable || r.fullyavailable)
	}

	return result
}

export const fetchEmployeeBasedOnId = async (employee) => {
	const res = await supabase.from('employees').select('*').eq('id', employee)

	return res
}
