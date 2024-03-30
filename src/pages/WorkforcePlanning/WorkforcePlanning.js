import React, { useEffect, useState } from 'react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'
import {
	Eventcalendar,
	setOptions,
	Popup,
	Button,
	Input,
	Datepicker,
	Select,
	momentTimezone,
	formatDate,
	CalendarNext,
	CalendarPrev,
	CalendarNav,
} from '@mobiscroll/react'
import moment from 'moment-timezone'
import './calendar.scss'

import { Loader, getHolidays } from 'reusables'

import { listAllEvents, createNewEvent, deleteEvent } from 'supabase/events'
import { listAllEmployees } from 'supabase/employees'
import { getProjectDetails, listAllProjects } from 'supabase/projects'

import Page from '../../components/Page'
import EventHeader from 'components/EventHeader'
import { Stack, Typography, Button as MuiButton, styled, Avatar } from '@mui/material'
import { useParams } from 'react-router-dom'

setOptions({
	theme: 'ios',
	themeVariant: 'light',
})
momentTimezone.moment = moment

const viewSettings = {
	timeline: {
		type: 'month',
		size: 2,
		eventList: true,
	},
}
const responsivePopup = {
	medium: {
		display: 'anchored',
		width: 520,
		fullScreen: false,
		touchUi: false,
	},
}

const defaultHolidays = [
	{ background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SU' } },
	{ background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SA' } },
]
const filters = { dw: true }

const breadcrumbElements = [
	<Typography key="4" color="text.primary">
		Daily workforce planning
	</Typography>,
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

function App() {
	const [myEvents, setMyEvents] = React.useState([])
	const [tempEvent, setTempEvent] = React.useState(null)
	const [isOpen, setOpen] = React.useState(false)
	const [isEdit, setEdit] = React.useState(false)
	const [anchor, setAnchor] = React.useState(null)
	const [start, startRef] = React.useState(null)
	const [end, endRef] = React.useState(null)
	const [popupEventTitle, setTitle] = React.useState('')
	const [popupEventSite, setSite] = React.useState('')
	const [popupEventColor, setColor] = React.useState('')
	const [popupEventDate, setDate] = React.useState([])
	const [mySelectedDate, setSelectedDate] = React.useState(new Date())
	const [checkedResources, setCheckedResources] = React.useState([])
	const [myResources, setMyResources] = React.useState([])
	const [invalid, setInvalid] = React.useState([
		{
			recurring: {
				repeat: 'daily',
			},
			resource: [],
		},
	])
	const [projectSites, setProjectSites] = React.useState([])
	const [loader, setLoader] = React.useState(false)
	const [projectError, setProjectError] = React.useState(false)
	const [holidays, setHolidays] = React.useState(defaultHolidays)

	const handleSetEvent = (data) => {
		setMyEvents(data.map((e) => ({ ...e, resource: e.employee })))
	}

	React.useEffect(() => {
		;(async function () {
			setLoader(true)
			// listAllEmployees().then((data) => {
			//   const resource = data.map((item) => item.id);
			//   setInvalid([
			//     {
			//       recurring: {
			//         repeat: 'daily',
			//       },
			//       resource,
			//     },
			//   ]);
			//   setMyResources(data);
			// });

			listAllEmployees().then((data) => {
				setMyResources(data?.data)
			})
			listAllEvents(filters).then((data) => handleSetEvent(data))

			listAllProjects().then((data) => {
				console.log(data, 'data')
				data = data?.data.map((item) => ({ text: item.title, value: item.id }))
				setLoader(false)
				setProjectSites(data)
			})
		})()
		return () => {}
	}, [])

	// get Project Data
	const [data, setData] = useState({})
	const { project } = useParams()
	const fetchData = async (id) => {
		const res = await getProjectDetails(id)
		if (res.status === 404) return
		setData(res.data)
	}
	useEffect(() => {
		if (project) fetchData(project)
	}, [project])

	const handleValidation = () => {
		if (popupEventSite !== null && popupEventSite !== '') {
			setProjectError(false)
			return true
		}
		setProjectError(true)
		return false
	}

	const saveEvent = React.useCallback(() => {
		if (handleValidation()) {
			setLoader(true)
			const startDate = moment(popupEventDate[0]).format('YYYY-MM-DD')
			const endDate = moment(popupEventDate[1]).format('YYYY-MM-DD')
			const newEvent = {
				title: popupEventTitle,
				start: startDate,
				end: endDate,
				project: popupEventSite,
				employee: checkedResources,
				type: 'dw',
			}
			createNewEvent(newEvent).then((res) => {
				listAllEvents(filters).then((data) => {
					setLoader(false)
					handleSetEvent(data)
				})
			})

			setMyEvents([...myEvents])

			// close the popup
			setOpen(false)
		}
	}, [isEdit, myEvents, popupEventDate, popupEventColor, popupEventTitle, popupEventSite, tempEvent, checkedResources])

	const renderMyResource = (resource) => {
		const parent = resource.children
		return (
			<Stack direction={'row'} gap={2} alignItems={'center'}>
				<Rating rating={resource.rating}>{resource.rating}</Rating>
				<div className={parent ? 'md-shift-resource' : ''} style={{ color: parent ? '#1dab2f' : '' }}>
					{resource.name}
				</div>

				{resource.team_lead && (
					<Typography
						style={{
							borderRadius: 3,
							background: '#FF6B00',
							color: 'white',
							fontSize: 8,
							height: 15,
							paddingInline: 5,
							paddingBlock: 1,
						}}
						variant={'caption'}
					>
						TEAM LEAD
					</Typography>
				)}
			</Stack>
		)
	}

	const loadPopupForm = React.useCallback((event) => {
		try {
			let startDate = new Date(event.start)
			let endDate = new Date(event.end)
			startDate = moment(startDate).format('YYYY-MM-DD')
			endDate = moment(endDate).format('YYYY-MM-DD')
			setTitle(event.title)
			setSite(event.location)
			setColor(event.color)
			setDate([startDate, endDate])
			setCheckedResources(event.resource)
		} catch (error) {
			console.log(error)
		}
	}, [])

	// handle popup form changes

	const dateChange = React.useCallback((args) => {
		setDate(args.value)
	}, [])

	const onDeleteClick = React.useCallback(() => {
		setLoader(true)
		deleteEvent(tempEvent.id).then((res) => {
			listAllEvents(filters).then((data) => {
				setLoader(false)
				handleSetEvent(data)
			})
		})

		setOpen(false)
	}, [deleteEvent, tempEvent])

	// scheduler options

	const onSelectedDateChange = React.useCallback((event) => {
		setSelectedDate(event.date)
	}, [])

	const onEventClick = React.useCallback(
		(args) => {
			setEdit(true)

			setTempEvent({ ...args.event })
			// fill popup form with event data
			loadPopupForm(args.event)
			setAnchor(args.domEvent.target)
			setOpen(true)
		},
		[loadPopupForm]
	)

	const onEventCreated = React.useCallback(
		(args) => {
			setEdit(false)
			setTempEvent(args.event)
			// fill popup form with event data
			loadPopupForm(args.event)
			setAnchor(args.target)
			// open the popup
			setOpen(true)
		},
		[loadPopupForm]
	)

	const onEventDeleted = React.useCallback(
		(args) => {
			deleteEvent(args.event)
		},
		[deleteEvent]
	)

	// popup options
	const headerText = React.useMemo(() => (isEdit ? 'View work order' : 'New work order'), [isEdit])
	const popupButtons = React.useMemo(() => {
		if (isEdit) {
			return ['cancel']
		}

		return [
			'cancel',
			{
				handler: () => {
					saveEvent()
				},
				keyCode: 'enter',
				text: 'Add',
				cssClass: 'mbsc-popup-button-primary',
			},
		]
	}, [isEdit, saveEvent])

	const onClose = React.useCallback(() => {
		if (!isEdit) {
			// refresh the list, if add popup was canceled, to remove the temporary event
			setMyEvents([...myEvents])
		}
		setOpen(false)
	}, [isEdit, myEvents])

	const extendDefaultEvent = React.useCallback(
		() => ({
			title: 'Work order',
			location: '',
		}),
		[]
	)

	async function onPageLoading(event) {
		const start = new Date(event.firstDay)
		const end = new Date(event.lastDay)
		const data = await getHolidays(start, end)
		if (data) setHolidays([...defaultHolidays, ...data])
	}

	const renderCustomDay = (args) => {
		const date = args.date
		return (
			<Stack p="10px" justifyContent="center" alignItems="center" className="custom-day-border">
				<Typography variant="body2" className="">
					{formatDate('DD', date)}
				</Typography>
				<Typography variant="caption" className="">
					{formatDate('DDD', date).substring(0, 1)}
				</Typography>
			</Stack>
		)
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

	const renderResourceHeader = () => (
		<Stack width="100%" flexDirection="row" justifyContent="space-between">
			<Typography textAlign="center" variant="subtitle1">
				Employee
			</Typography>
		</Stack>
	)

	return (
		<>
			<Page title="WP">
				<EventHeader title={data?.title} breadcrumbElements={breadcrumbElements} />
				<Stack px={2} mt={7}>
					<Loader open={loader} setOpen={setLoader} />
					<Eventcalendar
						cssClass="mbsc-calendar-planning  md-timeline-height"
						view={viewSettings}
						data={myEvents}
						invalid={invalid}
						displayTimezone="local"
						dataTimezone="local"
						onPageLoading={onPageLoading}
						renderHeader={renderHeader}
						renderResource={renderMyResource}
						renderResourceHeader={renderResourceHeader}
						resources={myResources}
						clickToCreate="double"
						dragToCreate={true}
						dragTimeStep={30}
						selectedDate={mySelectedDate}
						onSelectedDateChange={onSelectedDateChange}
						onEventClick={onEventClick}
						onEventCreated={onEventCreated}
						onEventDeleted={onEventDeleted}
						extendDefaultEvent={extendDefaultEvent}
						colors={holidays}
						renderDay={renderCustomDay}
						dayNamesMin={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
					/>

					<Popup
						display="bottom"
						fullScreen={true}
						contentPadding={false}
						headerText={headerText}
						anchor={anchor}
						buttons={popupButtons}
						isOpen={isOpen}
						onClose={onClose}
						responsive={responsivePopup}
					>
						<div className="mbsc-form-group">
							<Select
								disabled={isEdit}
								readOnly={isEdit}
								onChange={(e) => {
									setTitle(e.valueText)
									setSite(e.value)
								}}
								value={isEdit && tempEvent ? tempEvent.project : popupEventSite}
								data={projectSites}
								touchUi={false}
								label="Project Site"
								labelStyle="floating"
								error={projectError}
								errorMessage={'Please select a project'}
							/>
						</div>
						<div className="mbsc-form-group">
							<Input ref={startRef} label="Starts" />
							<Input ref={endRef} label="Ends" />
							<Datepicker
								disabled={isEdit}
								readOnly={isEdit}
								select="range"
								controls={['date']}
								touchUi={true}
								startInput={start}
								endInput={end}
								showRangeLabels={false}
								onChange={dateChange}
								value={popupEventDate}
							/>
						</div>

						<div className="mbsc-form-group">
							{isEdit && (
								<div className="mbsc-button-group">
									<Button className="mbsc-button-block" color="danger" variant="outline" onClick={onDeleteClick}>
										Delete event
									</Button>
								</div>
							)}
						</div>
					</Popup>
				</Stack>
			</Page>
		</>
	)
}

export default App
