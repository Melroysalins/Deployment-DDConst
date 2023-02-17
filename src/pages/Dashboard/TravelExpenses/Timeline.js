import './calendar.scss'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'

import {
	CalendarNav,
	CalendarNext,
	CalendarPrev,
	Eventcalendar,
	formatDate,
	momentTimezone,
	setOptions,
} from '@mobiscroll/react'
import { Alert, Avatar, Box, Button as MuiButton, Snackbar, Stack, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Iconify from 'components/Iconify'
import Popup from 'components/Popups/Popup'
import moment from 'moment-timezone'
import React from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Loader } from 'reusables'
import { createNewEvent, deleteEvent, editEvent, listAllEvents } from 'supabase/events'
import { getTeResources } from 'supabase/travelExpenses'

import useTE from './context/context'
import { TEActionType } from './context/types'
import getHolidays from './getHolidays'
import AddFormPopup from './popups/AddFormPopup'
import ViewEventPopup from './popups/ViewEventPopup'

// components
setOptions({
	theme: 'ios',
	themeVariant: 'light',
})
momentTimezone.moment = moment

const FilledLine = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'color',
})(({ theme, color }) => ({
	width: '20px',
	height: '4px',
	background: color,
	borderRadius: '4px',
}))

const viewSettings = {
	timeline: {
		type: 'month',
		size: 2,
		eventList: true,
	},
}

const initialFilters = { te: true, ste: true }

const defaultHolidays = [
	{ background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SU' } },
	{ background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SA' } },
]

export const Rating = styled(Avatar, {
	shouldForwardProp: (prop) => prop !== 'rating',
})(({ theme, rating }) => {
	let color = null
	switch (rating) {
		case 'S':
			color = theme.palette.chart.violet[0]
			break
		case 'A':
			color = theme.palette.chart.red[0]
			break
		case 'B':
			color = theme.palette.chart.yellow[0]
			break
		case 'C':
			color = theme.palette.chart.green[0]
			break

		default:
			color = theme.palette.grey[500]
			break
	}
	return {
		height: 20,
		width: 20,
		fontSize: 11,
		marginLeft: 11,
		backgroundColor: color,
	}
})

export default function Timeline() {
	const { state, dispatch } = useTE()
	const { id } = useParams()

	const [tempEvent, setTempEvent] = React.useState(null)
	const [isEdit, setEdit] = React.useState(false)
	const [anchor, setAnchor] = React.useState(null)
	const [anchorTeam, setAnchorTeam] = React.useState(null)
	const [popupData, setPopupData] = React.useState(null)
	const [employees, setEmployees] = React.useState([])
	const [mySelectedDate, setSelectedDate] = React.useState(new Date())
	const [invalid] = React.useState([
		{
			recurring: {
				repeat: 'daily',
			},
			resource: [],
		},
	])
	const [loader, setLoader] = React.useState(false)
	const [holidays, setHolidays] = React.useState(defaultHolidays)
	const [open, setOpenActions] = React.useState(false)

	const [openPopup, setOpenPopup] = React.useState(null)
	const [popupType, setPopupType] = React.useState(null)
	const [viewPopup, setViewPopup] = React.useState(null)
	const [filters, setFilters] = React.useState(initialFilters)
	const [toast, setToast] = React.useState(null)

	const handleCloseToast = () => {
		setToast(null)
	}

	const handlePopupTypeChange = React.useCallback((title) => setPopupType(title), [])

	const [searchParams] = useSearchParams()
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const handleFilters = React.useCallback(() => {
		let _filters = searchParams.get('filters')
		_filters = _filters?.split(',').reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
		if (_filters) setFilters((prev) => ({ ..._filters }))
		else
			navigate({
				pathname,
				search: `?filters=te,ste`,
			})
	}, [searchParams])

	const addTeEvent = async (values) => {
		setLoader(true)
		try {
			delete values.id
			const res = await createNewEvent(values)
			if (res.status >= 200 && res.status < 300) {
				// setToast({ severity: 'success', message: 'Succesfully added new event!' })
				dispatch({ type: TEActionType.BEEP, payload: true })
			} else {
				setToast({ severity: 'error', message: 'Failed to added new event!' })
			}
		} catch (err) {
			console.log(err)
		}
		setLoader(false)
	}
	// // for checking filter parameters
	React.useEffect(() => {
		handleFilters()
		return () => {}
	}, [searchParams])

	const onClose = React.useCallback(() => {
		if (!isEdit) {
			// refresh the list, if add popup was canceled, to remove the temporary event
			dispatch({ type: TEActionType.UPDATE_EVENTS, payload: [...state.events] })
		}
		setAnchor(null)
		setAnchorTeam(null)
	}, [dispatch, isEdit, state.events])

	const handleOpenViewPopup = React.useCallback(
		(anchor) => {
			setViewPopup(anchor)
		},
		[onClose]
	)

	const handleCloseViewPopup = React.useCallback(() => {
		setViewPopup(null)
	}, [onClose])

	const handleClosePopup = React.useCallback(() => {
		setOpenPopup(null)
		onClose()
	}, [onClose])

	const handleOpenPopup = React.useCallback((anchor) => {
		setOpenPopup(anchor)
		setAnchor(null)
	}, [])

	const handleToggle = () => setOpenActions((prev) => !prev)

	const updateCalendarData = React.useCallback((resources, events) => {
		const teamEvents = []
		let employees = []

		const updatedResources = resources.map((project) => ({
			...project,
			id: String(project.id),
			children: project.children.map((team) => {
				const teamEmployees = []
				const updatedEmployees =
					team?.children?.map((employee) => {
						teamEmployees.push({ id: String(employee.id), name: employee.name })
						return {
							...employee,
							id: String(employee.id),
							children: travelExpensesForEmployee(employee.id),
							collapsed: true,
						}
					}) ?? []
				teamEvents.push({
					title: `EMPLOYEES: ${teamEmployees.map((x) => x.name).join(', ')}`,
					resource: String(team.id),
					start: team.start,
					end: team.end,
				})
				employees = [...employees, ...teamEmployees]
				return {
					...team,
					children: updatedEmployees,
				}
			}),
		}))

		setEmployees(employees)

		const updatedEvents = events.map((event) => {
			const start = moment(event.start)
			const end = moment(event.end)
			end.set('hour', 23)
			end.set('minute', 59)
			return event.type === 'te' || event.sub_type === 'task'
				? { ...event, start, end, resource: `${event.employee}-${event.sub_type}` }
				: { ...event, start, end, resource: event.employee }
		})
		return { resources: updatedResources, events: [...updatedEvents, ...teamEvents] }
	}, [])

	// for handling calendar data to create one more layer with expenses of meals, lodging, task
	const fetchData = async (filters) => {
		// setLoading(true);
		// const res = await getProjectDetails(id);
		const resources = await getTeResources(id)
		const events = await listAllEvents(filters)
		const res = updateCalendarData(resources, events)
		dispatch({ type: TEActionType.UPDATE_RESOURCES, payload: res.resources })
		dispatch({ type: TEActionType.UPDATE_EVENTS, payload: res.events })
	}

	const fetchEvents = async (filters) => {
		const events = await listAllEvents(filters)
		const res = updateCalendarData(state.resources, events)
		dispatch({ type: TEActionType.UPDATE_EVENTS, payload: res.events })
	}

	React.useEffect(() => {
		fetchData(filters)
	}, [])

	React.useEffect(() => {
		if (state.beep) {
			fetchEvents(filters)
			dispatch({ type: TEActionType.BEEP, payload: false })
		}

		// const res = updateCalendarData(data.resources, data.events);
		// dispatch({ type: TEActionType.UPDATE_RESOURCES, payload: res.resources });
		// dispatch({ type: TEActionType.UPDATE_EVENTS, payload: res.events });
	}, [state.beep])

	React.useEffect(() => {
		fetchEvents(filters)
	}, [filters])

	const travelExpensesForEmployee = React.useCallback(
		(employee_id) => [
			{
				id: `${employee_id}-lodging`,
				type: 'lodging',
			},
			{
				id: `${employee_id}-meals`,
				type: 'meals',
			},
			{
				id: `${employee_id}-task`,
				type: 'task',
			},
		],
		[]
	)

	const renderMyResource = (resource) => (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				...(resource.depth === 3 && { justifyContent: 'flex-end' }),
			}}
		>
			{resource.name}
			{symbolsForResource(resource)}
		</Box>
	)
	const styles = (keyword, bgColor) => {
		switch (keyword) {
			case 'Planned':
				return {
					background: (theme) => theme.palette.background.paper,
					borderRadius: '8px',
					border: `2px solid ${bgColor}`,
					color: `${bgColor} !important`,
				}

			case 'Rejected':
				return {
					background: `repeating-linear-gradient( -45deg, ${bgColor}, ${bgColor} 5px, #fff 5px, #fff 10px )`,
					minWidth: 0,
					fontSize: '10px',
					color: `${bgColor} !important`,
				}

			case 'Approved':
				return {
					borderRadius: '8px',
					border: `2px solid ${bgColor}`,
				}

			default:
				break
		}
	}

	const renderScheduleEvent = (event) => {
		const bgColor = color(event.original.sub_type)
		const startDate = moment(event.startDate)
		const endDate = moment(event.endDate)
		const diff = endDate.diff(startDate, 'days') + 1

		if (event.original.type === 'te' || event.original.type === 'task') {
			return (
				<>
					<Stack
						component="div"
						justifyContent="flex-between"
						className="timeline-event"
						sx={{
							background: bgColor,
							color: bgColor === '#fff' ? '#000 !important' : '#fff !important',
							boxShadow: (theme) => theme.customShadows.z8,
							justifyContent: 'flex-between',
							alignItems: 'initial !important',
							padding: '0 !important',
							...styles(event.original.status, bgColor),
						}}
					>
						{event.original.status === 'Rejected' ? (
							<Typography
								variant="caption"
								sx={{ background: (theme) => theme.palette.background.paper, lineHeight: 'inherit' }}
							>
								{diff}하숙
							</Typography>
						) : (
							<>{diff}하숙</>
						)}
					</Stack>
				</>
			)
		}

		return (
			<>
				<Box
					component="div"
					className="timeline-event"
					sx={{
						background: bgColor,
						color: bgColor === '#fff' ? '#000 !important' : '#fff !important',
						boxShadow: (theme) => theme.customShadows.z8,
						...styles(event.original.status, bgColor),
					}}
				>
					{event.title}
				</Box>
			</>
		)
	}

	const symbolsForResource = React.useCallback((resource) => {
		switch (resource.depth) {
			case 0:
				return (
					<>
						<Stack direction="column">
							<Typography variant="caption">{resource.branchTitle}</Typography>
							<Typography variant="subtitle2">{resource.projectTitle}</Typography>
						</Stack>
					</>
				)
			case 1:
				return (
					<Rating rating={resource.rating}>
						{resource.team_type === 'InHome' ? (
							<Iconify icon="material-symbols:home-outline-rounded" width={15} height={15} />
						) : (
							<Iconify icon="material-symbols:handshake-outline" width={15} height={15} />
						)}
					</Rating>
				)
			case 2:
				// if (resource.teamLead)
				//   return (
				//     <Typography
				//       variant="overline"
				//       sx={{
				//         background: '#FF6B00',
				//         boxShadow: (theme) => theme.customShadows.z8,
				//         borderRadius: '4px',
				//         padding: '0px 4px',
				//         color: '#fff',
				//         fontSize: '12px',
				//       }}
				//     >
				//       Team lead
				//     </Typography>
				//   );
				return <Rating rating={resource.rating}>{resource.rating}</Rating>
			case 3:
				if (resource.type === 'lodging') {
					return (
						<Tooltip title="Lodging" arrow>
							<Iconify icon="icon-park-outline:double-bed" width={15} height={15} />
						</Tooltip>
					)
				}
				if (resource.type === 'meals') {
					return (
						<Tooltip title="Lodging" arrow>
							<Iconify icon="bxs:bowl-rice" width={15} height={15} />
						</Tooltip>
					)
				}
				return <Iconify icon="mdi:calendar-task-outline" width={15} height={15} />
			default:
				break
		}
	}, [])

	const renderCustomHeader = () => (
		<Stack width="100%" flexDirection="row" justifyContent="space-between">
			<Typography textAlign="center" variant="subtitle2">
				Project
			</Typography>
			<Stack flexDirection="row">
				{open && (
					<>
						<MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
							<Iconify icon="tabler:crane" width={20} height={20} />
						</MuiButton>
						<Tooltip title="Add travel expenses" arrow>
							<MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
								<Iconify icon="lucide:calendar-check" width={20} height={20} />
							</MuiButton>
						</Tooltip>
						<Tooltip title="Add special travel expenses" arrow>
							<MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
								<Iconify icon="tabler:plane-tilt" width={20} height={20} />
							</MuiButton>
						</Tooltip>
						<Tooltip title="Add overtime" arrow>
							<MuiButton sx={{ minWidth: 0 }} size="small" color="inherit">
								<Iconify icon="mdi:auto-pay" width={20} height={20} />
							</MuiButton>
						</Tooltip>
					</>
				)}
				<MuiButton onClick={handleToggle} sx={{ minWidth: 0 }} size="small" color="inherit">
					<Iconify icon={`ic:baseline-${open ? 'minus' : 'plus'}`} width={20} height={20} />
				</MuiButton>
			</Stack>
		</Stack>
	)

	const loadPopupForm = React.useCallback((event) => {
		try {
			let startDate = new Date(event.start)
			let endDate = new Date(event.end)
			startDate = moment(startDate).format('YYYY-MM-DD')
			endDate = moment(endDate).format('YYYY-MM-DD')
			const resource = String(event?.resource)?.split('-')
			const { sub_type, id, status } = event
			const data = {
				start: startDate,
				end: endDate,
				employee: resource.length === 1 && String(event?.resource)?.split('|').length === 2 ? null : resource[0],
				sub_type: sub_type ?? resource[1],
				id,
				status: status ?? 'Planned',
				...(resource.length === 1 && String(event?.resource)?.split('|').length === 2 && { teamData: event?.resource }),
			}
			setPopupData(data)
			return data
		} catch (error) {
			console.log(error)
		}
	}, [])

	// scheduler options

	const onSelectedDateChange = React.useCallback((event) => {
		setSelectedDate(event.date)
	}, [])

	const onEventClick = React.useCallback(
		(args) => {
			try {
				setEdit(true)
				setTempEvent({ ...args.event })
				// fill popup form with event data
				loadPopupForm(args.event)
				const expense_type = String(args?.event?.resource)?.split('-')
				if (
					(expense_type.length > 1 && (expense_type[1] === 'lodging' || expense_type[1] === 'meals')) ||
					args.event.type === 'ste'
				) {
					handlePopupTypeChange(args.event.type)
					handleOpenViewPopup(args.domEvent.target)
				} else {
					// setAnchor(args.target);
				}
			} catch (e) {
				console.log(e)
			}
		},
		[loadPopupForm]
	)

	const onEventCreated = React.useCallback(
		(args) => {
			console.log(args)
			setEdit(false)
			setTempEvent(args.event)
			const expense_type = args.event.resource?.split('-')
			if ((expense_type.length > 1 && expense_type[1] !== 'task') || args.event.type === 'te') {
				handlePopupTypeChange('te')
				console.log(args)
				// handleOpenPopup(args.target)
				const data = loadPopupForm(args.event)
				addTeEvent({ ...data, type: 'te' })
			} else if (args.event.type === 'ste') {
				const data = loadPopupForm(args.event)
				addTeEvent({ ...data, type: 'ste' })
			} else {
				// eslint-disable-next-line no-unused-expressions
				String(args.event?.resource)?.split('|').length === 2 ? setAnchorTeam(args.target) : setAnchor(args.target)
				loadPopupForm(args.event)
			}
			// fill popup form with event data

			// open the popup
		},
		[loadPopupForm]
	)

	const onEventUpdate = React.useCallback(
		({ event }) => {
			try {
				const start = moment(event.start).format('YYYY-MM-DD')
				const end = moment(event.end).format('YYYY-MM-DD')
				setTempEvent(event)

				// fill popup form with event data
				editEvent({ start, end }, event.id).then(() => {
					dispatch({ type: TEActionType.BEEP, payload: true })
				})
			} catch (e) {
				console.log(e)
			}

			// open the popup
		},
		[loadPopupForm]
	)

	const onEventDeleted = React.useCallback(
		(args) => {
			deleteEvent(args.event)
		},
		[deleteEvent]
	)

	const extendDefaultEvent = React.useCallback(
		() => ({
			title: 'Add Expenses',
			location: '',
		}),
		[]
	)

	async function onPageLoading(event, inst) {
		const start = new Date(event.firstDay)
		const end = new Date(event.lastDay)
		const data = await getHolidays(start, end)
		if (data) setHolidays(() => [...defaultHolidays, ...data])
	}
	const renderHeader = () => (
		<>
			<Stack sx={{ color: 'black' }} flexDirection="row" justifyContent="space-between" width="100%">
				<MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 0, minWidth: 0 }}>
					<CalendarPrev className="cal-header-prev" />
				</MuiButton>
				<CalendarNav className="cal-header-nav" />
				<MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 0, minWidth: 0 }}>
					<CalendarNext className="cal-header-next" />
				</MuiButton>
			</Stack>
		</>
	)

	const renderCustomDay = (args) => {
		const date = args.date
		let eventOccurrence = 'none'

		if (args.events) {
			const eventNr = args.events.length
			if (eventNr === 0) {
				eventOccurrence = 'none'
			} else if (eventNr === 1) {
				eventOccurrence = 'one'
			} else if (eventNr < 4) {
				eventOccurrence = 'few'
			} else {
				eventOccurrence = 'more'
			}
		}

		return (
			<Stack p="10px" justifyContent="center" alignItems="center" className="">
				<Typography variant="body2" className="">
					{formatDate('DD', date)}
				</Typography>
				<Typography variant="caption" className="">
					{formatDate('DDD', date).substring(0, 1)}
				</Typography>
			</Stack>
		)
	}

	const onSubmit = async (sub_type, status = 'Planned', type = 'te') => {
		const obj = state.resources[0]?.children
			?.find((e) => e.id === popupData?.teamData)
			?.children?.map((e) => ({
				employee: e.id,
				type,
				sub_type,
				start: popupData.start,
				end: popupData.end,
				status,
			}))
		setLoader(true)
		try {
			const promises = obj.map(async (detail) => {
				// eslint-disable-next-line no-async-promise-executor
				const promiseArr = new Promise(async (resolve, reject) => {
					const res = await createNewEvent(detail)
					if (res.status >= 200 && res.status < 300) {
						resolve(res)
					} else {
						reject(res)
					}
				})
				return promiseArr
			})
			await Promise.all(promises)
				.then(() => {
					fetchData({ te: true, ste: true })
					setToast({ severity: 'success', message: 'Succesfully added new event!' })
					dispatch({ type: TEActionType.BEEP, payload: true })
					handleClosePopup()
					handleCloseViewPopup()
				})
				.catch(() => setToast({ severity: 'error', message: 'Failed to added new event!' }))
		} catch (err) {
			console.log(err)
		}
		setLoader(false)
	}

	return (
		<>
			{popupType && (
				<AddFormPopup
					data={popupData}
					employees={employees}
					type={popupType}
					handleClose={handleClosePopup}
					anchor={openPopup}
				/>
			)}
			{popupType && (
				<ViewEventPopup
					employees={employees}
					data={popupData}
					type={popupType}
					handleClose={handleCloseViewPopup}
					anchor={viewPopup}
				/>
			)}

			<Loader open={loader} setOpen={setLoader} />
			<Snackbar
				open={toast}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				autoHideDuration={5000}
				onClose={handleCloseToast}
			>
				<Alert onClose={handleCloseToast} severity={toast?.severity} sx={{ width: '100%' }}>
					{toast?.message}
				</Alert>
			</Snackbar>
			<Eventcalendar
				cssClass="mbsc-calendar-projects md-timeline-height"
				view={viewSettings}
				data={state.events}
				invalid={invalid}
				onPageLoading={onPageLoading}
				renderResource={renderMyResource}
				renderScheduleEvent={renderScheduleEvent}
				renderHeader={renderHeader}
				renderResourceHeader={renderCustomHeader}
				resources={state.resources}
				clickToCreate="double"
				dragToCreate={true}
				dragToMove
				dragToResize
				externalDrop
				onEventUpdate={onEventUpdate}
				dragTimeStep={30}
				selectedDate={mySelectedDate}
				onSelectedDateChange={onSelectedDateChange}
				showEventTooltip={false}
				onEventClick={onEventClick}
				onEventCreated={onEventCreated}
				onEventDeleted={onEventDeleted}
				extendDefaultEvent={extendDefaultEvent}
				renderDay={renderCustomDay}
				colors={holidays}
				dayNamesMin={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
			/>

			<Popup variant="secondary" anchor={anchorTeam} handleClose={onClose}>
				<Stack flexDirection="row" justifyContent="space-between" sx={{ p: 1 }}>
					<MuiButton
						onClick={() => onSubmit('lodging')}
						startIcon={<Iconify icon="icon-park-outline:double-bed" width={15} height={15} />}
						size="small"
						color="inherit"
					>
						Add Lodging
					</MuiButton>
					<MuiButton
						onClick={() => onSubmit('meals')}
						startIcon={<Iconify icon="bxs:bowl-rice" width={15} height={15} />}
						size="small"
						color="inherit"
					>
						Add Meals
					</MuiButton>
				</Stack>
			</Popup>

			<Popup variant="secondary" anchor={anchor} handleClose={onClose}>
				<Stack width="max-content" flexDirection="row" justifyContent="space-between" sx={{ p: 1 }}>
					<MuiButton
						onClick={() => {
							addTeEvent({ ...popupData, type: 'ste', sub_type: 'overtime' })
							setAnchor(null)
						}}
						size="small"
						color="inherit"
					>
						<Typography sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }} variant="caption">
							<FilledLine color="#DA4C57" />
							&nbsp;Add Overtime
						</Typography>
					</MuiButton>
					<MuiButton
						onClick={() => {
							addTeEvent({ ...popupData, type: 'ste', sub_type: 'nightTime' })
							setAnchor(null)
						}}
						size="small"
						color="inherit"
					>
						<Typography sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }} variant="caption">
							<FilledLine color="#8FA429" />
							&nbsp;Add Night-time
						</Typography>
					</MuiButton>
					<MuiButton
						onClick={() => {
							addTeEvent({ ...popupData, type: 'ste', sub_type: 'restDayMove' })
							setAnchor(null)
						}}
						size="small"
						color="inherit"
					>
						<Typography sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }} variant="caption">
							<FilledLine color="#A3888C" />
							&nbsp;Add Rest day move
						</Typography>
					</MuiButton>
				</Stack>
			</Popup>
		</>
	)
}

const color = (type) => {
	switch (type) {
		case 'lodging':
			return '#FFA58D'
		case 'meals':
			return '#85CDB7'
		case 'task':
			return '#BDB2E9'
		case 'overtime':
			return '#DA4C57'
		case 'nightTime':
			return '#8FA429'
		case 'restDayMove':
			return '#A3888C'
		case 'blockedDays':
			return '#919EAB'

		default:
			return '#fff'
	}
}
