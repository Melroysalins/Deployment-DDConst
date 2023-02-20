import { supabase } from 'lib/api'
import moment from 'moment'
import { dummyArrayEmpty } from 'utils/helper'

export const getTeResources = async (id) => {
	const { data: projects, error } = await supabase
		.from('projects_teams_employees')
		.select('*')
		.not('teams', 'is', null)
		.eq('id', id)
	const { data: teamEmployees, error: error2 } = await supabase
		.from('teams_employees')
		.select('*')
		.not('employees', 'is', null)
	if (error || error2) {
		console.log('in error')
		return error
	}
	const returnData = projects.map((project) => ({
		id: `project_|${project.id}`,
		projectTitle: project.title,
		branchTitle: project.title,
		children: project.teams.map((team) => {
			const { employees } = teamEmployees.find((e) => e.id === team.id) || {}
			return {
				id: `team_ |${team.id}`,
				// "created_at": "2022-10-07T04:37:36.062981+00:00",
				name: team.name,
				team_type: team.type,
				start: team.start,
				end: team.end,
				children: employees,
			}
		}),
	}))
	// console.log(inspect(returnData, true, 5));
	return returnData
}

export const getTeTotals = async (dateRange, projectId) => {
	const { data: projects, error } = await supabase
		.from('projects_teams_employees')
		.select('*')
		.not('teams', 'is', null)
		.eq('id', projectId)

	const { data: teamEmployees, error: error2 } = await supabase
		.from('teams_employees')
		.select('*')
		.not('employees', 'is', null)

	const start_date =
		dateRange && dateRange[0]
			? moment(dateRange[0]).format('YYYY-MM-DD')
			: moment().startOf('month').format('YYYY-MM-DD')
	const end_date =
		dateRange && dateRange[1] ? moment(dateRange[1]).format('YYYY-MM-DD') : moment().endOf('month').format('YYYY-MM-DD')

	const { data: totals, error: error3 } = await supabase.rpc('get_totals', {
		start_date,
		end_date,
	})
	if (error || error2 || error3) {
		console.log('in error')
		return error || error2 || error3
	}
	const returnData = projects.map((project) => ({
		id: `project_|${project.id}`,
		projectTitle: project.title,
		branchTitle: project.title,
		values: createDataRow(totals), // .filter((e) => e.project === project.id
		children: project.teams.map((team) => {
			const { employees } = teamEmployees.find((e) => e.id === team.id) || {}
			return {
				id: `team_ |${team.id}`,
				// "created_at": "2022-10-07T04:37:36.062981+00:00",
				name: team.name,
				team_type: team.type,
				start: team.start,
				end: team.end,
				values: createDataRow(totals.filter((e) => e.team === team.id)),

				children: employees.map((emp) =>
					createDataRow(
						totals.filter((e) => e.employee === emp.id && e.team === team.id),
						emp
					)
				),
			}
		}),
	}))
	return returnData
}

const ExpenseConstant = {
	lodging: 45000,
	meals: 30000,
	overtime: 100000,
	restDayMove: 50000,
	nightTime: 50000,
}

const createDataRow = (data, obj) => {
	let values = []
	values = dummyArrayEmpty(12)
	data.map((e) => {
		switch (e.event_sub_type) {
			case 'lodging':
				rowAdd(0, values, e)
				values[2] = values[0] * ExpenseConstant.lodging
				break
			case 'meals':
				rowAdd(1, values, e)
				values[3] = values[1] * ExpenseConstant.meals
				break
			case 'overtime':
				rowAdd(6, values, e)
				values[8] = values[6] * ExpenseConstant.overtime
				break
			case 'restDayMove':
			case 'nightTime':
				rowAdd(7, values, e)
				values[9] = values[7] * ExpenseConstant.restDayMove
				break
			default:
				break
		}
		return ''
	})
	if (values[9] || values[8]) {
		values[11] = (values[9] === '-' ? 0 : values[9]) + (values[8] === '-' ? 0 : values[8]) || '-'
	}
	if (values[2] || values[3]) {
		values[5] = (values[2] === '-' ? 0 : values[2]) + (values[3] === '-' ? 0 : values[3]) || '-'
	}

	return obj ? { ...obj, values } : values
}

const rowAdd = (row, values, e) => {
	values[row] = e.no_of_days + (values[row] === '-' ? 0 : values[row])
}

export const getTeamTitleEvents = async (projectId) => {
	const { data: project_tasks, error } = await supabase
		.from('project_tasks')
		.select('*')
		.not('team', 'is', null)
		.eq('project', projectId)

	const events = []
	const { data: teamEmployees, error: error2 } = await supabase
		.from('teams_employees')
		.select('*')
		.not('employees', 'is', null)

	project_tasks.map(async ({ team, start, end }) => {
		const { employees } = teamEmployees.find((e) => e.id === team)

		events.push({
			title: `EMPLOYEES: ${employees.map((x) => x.name).join(', ')}`,
			resource: `team_ |${team}`,
			start,
			end,
		})
	})

	console.log(events)
	const totals = await addDetailsInEvent(events, projectId)
	console.log(totals)
	return events
}

const addDetailsInEvent = async (events, project) => {
	const data = await Promise.all(
		events.map(async (event) => {
			const { data: totals, error: error3 } = await supabase
				.rpc('get_totals', {
					start_date: moment(event.start).format('YYYY-MM-DD'),
					end_date: moment(event.end).format('YYYY-MM-DD'),
				})
				.match({ team: event.resource.split('|')[1] })
			const calculated_totals = {}
			totals.forEach((item) => {
				// eslint-disable-next-line no-unused-expressions
				calculated_totals[item.event_sub_type] !== undefined
					? (calculated_totals[item.event_sub_type] += item.no_of_days)
					: (calculated_totals[item.event_sub_type] = item.no_of_days)
			})
			event.title = [
				event.title,
				...Object.keys(calculated_totals).map(
					(key) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${calculated_totals[key]}`
				),
			].join(', ')
			return event
		})
	)

	return data
}
