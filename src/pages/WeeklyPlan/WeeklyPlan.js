import React from 'react'
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
} from '@mobiscroll/react'
import moment from 'moment-timezone'
import './calendar.scss'

import { Loader, getHolidays } from 'reusables'

import { listAllEvents, createNewEvent, deleteEvent } from 'supabase/events'
import { listAllEmployees } from 'supabase/employees'
import { listAllProjects } from 'supabase/projects'

import Page from '../../components/Page'

setOptions({
	theme: 'ios',
	themeVariant: 'light',
})
momentTimezone.moment = moment

const viewSettings = {
	timeline: {
		type: 'week',
		size: 2,
		eventList: true,
		// startDay: 0,
		// endDay: 7,
		// weekNumbers: true
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
		const d = formatDate('DD DDD', args.date)
		const isFirstDay = args.date.getDay() === 0 // Sunday, but it can vary depending on your first day of week option
		const now = new Date()
		const cutOff = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()))
		const thisWeek = args.date < cutOff
		const div = (
			<div>
				<div className="first-day">{isFirstDay && <>{thisWeek ? 'This Weekly Progress' : 'Next Weeks Plan'}</>}</div>
				<div style={{ marginTop: 30 }} className="main-day">
					{d}
				</div>
			</div>
		)
		return div

		// const d = formatDate('DD DDD', args.date)
		// const isFirstDay = args.date.getDay() === 0 // Sunday, but it can vary depending on your first day of week option
		// const now = new Date()
		// const cutOff = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()))
		// const thisWeek = args.date < cutOff;
		// // return <div>This week Progress</div>
		// return <div className={'md-date-header md-date-header-events-' + eventOccurrence}>
		//     <div className="md-date-header-day-name">{formatDate('DDD', date)}</div>
		//      <div className="md-date-header-day-nr">{formatDate('DD', date)}</div>
		//  </div>;
		// 		return `<div ${isFirstDay ? 'class="first-day"' : ''} style="height: 28px;">${
		// 			isFirstDay ? (thisWeek ? 'This weeks progress' : 'Next weeks plan') : ''
		// 		}</div>
		// <div>${d}</div>`
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
				data = data?.data.map((item) => ({ text: item.title, value: item.id }))
				setLoader(false)
				setProjectSites(data)
			})
		})()
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
			<div className={parent ? 'md-shift-resource' : ''} style={{ color: parent ? '#1dab2f' : '' }}>
				{resource.name}
			</div>
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
	//   const renderCustomDay1 = (data) => {
	//     const d = formatDate('DD DDD', data.date);
	//     const isFirstDay = data.date.getDay() === 0; // Sunday, but it can vary depending on your first day of week option
	//     const now = new Date();
	//     const cutOff = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()));
	//     const thisWeek = data.date < cutOff;
	//     return `<div ${isFirstDay ? 'class="first-day"' : ''} style="height: 28px;">${
	//         isFirstDay ? (thisWeek ? 'This weeks progress' : 'Next weeks plan') : ''
	//     }</div>
	//  <div>${d}</div>`;
	//  }

	return (
		<>
			<Page title="WP">
				<Loader open={loader} setOpen={setLoader} />
				<Eventcalendar
					view={viewSettings}
					data={myEvents}
					invalid={invalid}
					displayTimezone="local"
					dataTimezone="local"
					onPageLoading={onPageLoading}
					renderResource={renderMyResource}
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
			</Page>
		</>
	)
}

export default App
