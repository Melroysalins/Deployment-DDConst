/* eslint-disable func-names */
import React from 'react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'
import { Eventcalendar, setOptions, Popup, Button, Input, Datepicker, momentTimezone } from '@mobiscroll/react'
import moment from 'moment-timezone'
import './calendar.scss'

import { Loader, getHolidays } from 'reusables'
import { useParams } from 'react-router'
import { listAllTasksByProject, updateNestedTasks, updateTask } from 'supabase'
import { differenceInDays } from 'utils/formatTime'

setOptions({
	theme: 'ios',
	themeVariant: 'light',
})
momentTimezone.moment = moment

const viewSettings = {
	timeline: {
		type: 'year',
		eventList: true,
		weekNumbers: false,
	},
}
// const responsivePopup = {
// 	medium: {
// 		display: 'anchored',
// 		width: 520,
// 		fullScreen: false,
// 		touchUi: false,
// 	},
// }

const defaultHolidays = [
	{ background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SU' } },
	{ background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SA' } },
]

function App() {
	const { project } = useParams()
	const [myEvents, setMyEvents] = React.useState([])
	const [tempEvent, setTempEvent] = React.useState(null)
	const [isOpen, setOpen] = React.useState(false)
	const [isEdit, setEdit] = React.useState(false)
	// const [anchor, setAnchor] = React.useState(null)
	// const [start, startRef] = React.useState(null)
	// const [end, endRef] = React.useState(null)
	const [popupEventTitle, setTitle] = React.useState('')
	const [popupEventSite, setSite] = React.useState('')
	const [popupEventColor, setColor] = React.useState('')
	const [popupEventDate, setDate] = React.useState([])
	const [mySelectedDate, setSelectedDate] = React.useState(new Date())
	const [checkedResources, setCheckedResources] = React.useState([])
	const [myResources, setMyResources] = React.useState([])

	const [loader, setLoader] = React.useState(false)
	const [projectError, setProjectError] = React.useState(false)
	const [holidays, setHolidays] = React.useState(defaultHolidays)

	const handleSetEvent = (data) => {
		const newData = data.flatMap((event) => {
			event.start = new Date(event.start)
			event.end = new Date(event.end)
			const mainEvent = { ...event, resource: event.task_group }
			const nestedEvents = event.nested_tasks.map((nestedTask) => ({
				...nestedTask,
				start: new Date(nestedTask.start),
				end: new Date(nestedTask.end),
				resource: event.task_group,
			}))
			return [mainEvent, ...nestedEvents]
		})
		// setMyEvents(data.map((e) => ({ ...e, resource: e.task_group })))
		setMyEvents(newData)
	}

	const handlesetMyResources = (data) => {
		const unique = [...new Map(data.map((item) => [item.task_group, item])).values()]
		setMyResources(unique.map((e) => ({ id: e.task_group, task_group: e.task_group })))
	}

	const createEventsByProject = () => {
		listAllTasksByProject(project).then((data) => {
			handleSetEvent(data?.data)
			handlesetMyResources(data?.data)
		})
	}

	React.useEffect(() => {
		createEventsByProject()
		return () => {}
	}, [])

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
				site_id: popupEventSite,
				employee_id: checkedResources,
			}

			setMyEvents([...myEvents])

			// close the popup
			setOpen(false)
		}
	}, [isEdit, myEvents, popupEventDate, popupEventColor, popupEventTitle, popupEventSite, tempEvent, checkedResources])

	const renderMyResource = (resource) => <div>{resource.task_group}</div>

	const renderScheduleEvent = (event) => {
		const bg = event.original?.project_task ? '#8D99FF' : '#BDB2E9'
		const color = 'white'
		const border = null
		let title = event.title
		const { nested_tasks, start, end } = event.original
		if (nested_tasks) {
			const last = nested_tasks[nested_tasks.length - 1]?.title.split('-')[1]
			title += ` (${differenceInDays(start, end) + 1} DAYS, ${last} WORK DAYS)`
		}
		return (
			<div className="timeline-event" style={{ background: bg, color, border }}>
				{title}
			</div>
		)
	}

	// const loadPopupForm = React.useCallback((event) => {
	// 	try {
	// 		let startDate = new Date(event.start)
	// 		let endDate = new Date(event.end)
	// 		startDate = moment(startDate).format('YYYY-MM-DD')
	// 		endDate = moment(endDate).format('YYYY-MM-DD')
	// 		setTitle('')
	// 		setSite(event.location)
	// 		setColor(event.color)
	// 		setDate([startDate, endDate])
	// 		setCheckedResources(event.resource)
	// 	} catch (error) {
	// 		console.log(error)
	// 	}
	// }, [])

	// handle popup form changes

	// const dateChange = React.useCallback((args) => {
	// 	setDate(args.value)
	// }, [])

	// const onDeleteClick = React.useCallback(() => {
	// 	setLoader(true)

	// 	setOpen(false)
	// }, [tempEvent])

	// // scheduler options

	// const onSelectedDateChange = React.useCallback((event) => {
	// 	setSelectedDate(event.date)
	// }, [])

	// const onEventClick = React.useCallback(
	// 	(args) => {
	// 		setEdit(true)

	// 		setTempEvent({ ...args.event })
	// 		// fill popup form with event data
	// 		loadPopupForm(args.event)
	// 		setAnchor(args.domEvent.target)
	// 		setOpen(true)
	// 	},
	// 	[loadPopupForm]
	// )

	// const onEventCreated = React.useCallback(
	// 	(args) => {
	// 		setEdit(false)
	// 		setTempEvent(args.event)
	// 		// fill popup form with event data
	// 		loadPopupForm(args.event)
	// 		setAnchor(args.target)
	// 		// open the popup
	// 		setOpen(true)
	// 	},
	// 	[loadPopupForm]
	// )

	// const onEventDeleted = React.useCallback((args) => {}, [])

	// popup options
	// const headerText = React.useMemo(() => (isEdit ? 'View work order' : 'New work order'), [isEdit])
	// const popupButtons = React.useMemo(() => {
	// 	if (isEdit) {
	// 		return ['cancel']
	// 	}

	// 	return [
	// 		'cancel',
	// 		{
	// 			handler: () => {
	// 				saveEvent()
	// 			},
	// 			keyCode: 'enter',
	// 			text: 'Add',
	// 			cssClass: 'mbsc-popup-button-primary',
	// 		},
	// 	]
	// }, [isEdit, saveEvent])

	// const onClose = React.useCallback(() => {
	// 	if (!isEdit) {
	// 		// refresh the list, if add popup was canceled, to remove the temporary event
	// 		setMyEvents([...myEvents])
	// 	}
	// 	setOpen(false)
	// }, [isEdit, myEvents])

	// const extendDefaultEvent = React.useCallback(
	// 	(args) => ({
	// 		title: 'Work order',
	// 		location: '',
	// 	}),
	// 	[]
	// )

	async function onPageLoading(event, inst) {
		const start = new Date(event.firstDay)
		const end = new Date(event.lastDay)
		const data = await getHolidays(start, end)
		if (data) setHolidays((prev) => [...defaultHolidays, ...data])
	}

	const handleDrag = async (event) => {
		const { nested_tasks, id } = event
		if (nested_tasks) {
			await updateNestedTasks([event.start, event.end], id)
			await updateTask(event, id)
			createEventsByProject()
		} else {
			// createEventsByProject()
		}
	}

	return (
		<>
			<Loader open={loader} setOpen={setLoader} />
			<Eventcalendar
				view={viewSettings}
				data={myEvents}
				displayTimezone="local"
				dataTimezone="local"
				onPageLoading={onPageLoading}
				renderResource={renderMyResource}
				renderScheduleEvent={renderScheduleEvent}
				resources={myResources}
				clickToCreate="double"
				dragToCreate={false}
				dragTimeStep={30}
				onEventDragEnd={({ event }) => handleDrag(event)}
				dragToResize={true}
				// selectedDate={mySelectedDate}
				// onSelectedDateChange={onSelectedDateChange}
				// onEventClick={onEventClick}
				// onEventCreated={onEventCreated}
				// onEventDeleted={onEventDeleted}
				// extendDefaultEvent={extendDefaultEvent}
				colors={holidays}
			/>
			{/* <Popup
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
					<Input
						readOnly={isEdit}
						onChange={(e) => {
							setTitle(e.target.value)
						}}
						value={popupEventTitle}
						touchUi={false}
						label="Work Order"
						labelStyle="floating"
						error={projectError}
						errorMessage={'Please select a title'}
					/>
				</div>
				<div className="mbsc-form-group">
					<Input
						value={popupEventColor}
						onChange={(e) => {
							setColor(e.target.value)
						}}
						type="color"
						name=""
						id=""
						label="Color"
					/>{' '}
				</div>
				<div className="mbsc-form-group">
					<Input ref={startRef} label="Starts" />
					<Input ref={endRef} label="Ends" />
					<Datepicker
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
			</Popup> */}
		</>
	)
}

export default App
