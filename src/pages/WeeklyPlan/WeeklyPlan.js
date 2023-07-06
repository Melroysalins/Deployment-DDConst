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
	CalendarPrev,
	CalendarNext,
	CalendarNav,
} from '@mobiscroll/react'
import moment from 'moment-timezone'
import './calendar.scss'

import { Loader, getHolidays } from 'reusables'

import { listAllEvents, createNewEvent, deleteEvent } from 'supabase/events'
import { listAllEmployees } from 'supabase/employees'
import { listAllProjects } from 'supabase/projects'

import Page from '../../components/Page'
import { Stack, Button as MuiButton, Grid, Box, Container } from '@mui/material'
import LeftMenu from './LeftMenu'
import ProgressRate from './ProgressRate'
import Drawer from './Drawer'
import { useNavigate } from 'react-router-dom'
import Iconify from 'components/Iconify'
import Message from './Message'
import BasicTabs from 'components/Drawer/BasicTabs'

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
	const [isDrawerOpen, setisDrawerOpen] = React.useState(false)
	const navigate = useNavigate()
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

		const startOfWeek = moment(date).subtract(1, 'weeks').startOf('week').toDate().toLocaleDateString()
		const endOfWeek = moment(date).subtract(1, 'weeks').endOf('week').toDate().toLocaleDateString()
		const startNextWeek = moment(date).startOf('week').toDate().toLocaleDateString()
		const endNextWeek = moment(date).endOf('week').toDate().toLocaleDateString()

		const div = (
			<div>
				<div className="first-day" style={{ borderBottom: `1px solid ${thisWeek ? '#DA4C57' : '#8CCC67'}` }}>
					{isFirstDay && (
						<>
							{thisWeek
								? `This Week Progress (${startOfWeek} - ${endOfWeek})`
								: `Next Weeks Plan (${startNextWeek} - ${endNextWeek})`}
						</>
					)}
				</div>
				<div className="first-day" style={{ marginTop: 30, left: 100, fontSize: '0.88rem' }}>
					{isFirstDay && (
						<>
							{thisWeek ? (
								<span>
									APPROVAL STATUS: <span style={{ color: '#DA4C57' }}>Rejected</span>
								</span>
							) : (
								<span>
									APPROVAL STATUS: <span style={{ color: '#8CCC67' }}>Approved</span>
								</span>
							)}
						</>
					)}
				</div>
				<div style={{ marginTop: 60 }} className="main-day">
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

	const renderCustomResource = (resource) => (
		<div className="md-resource-header-template-cont">
			<div className="md-resource-header-template-name">{resource.name}</div>
			<div className="md-resource-header-template-seats">Location</div>
		</div>
	)

	const renderCustomHeader = () => (
		<>
			<div className="md-resource-header-template-title">
				<div className="md-resource-header-template-name">Work</div>
				<div className="md-resource-header-template-seats">Location</div>
			</div>
		</>
	)

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
	const renderHeader = () => (
		<>
			<Stack
				sx={{ color: 'black', background: 'white' }}
				flexDirection="row"
				justifyContent="space-between"
				width="100%"
			>
				<MuiButton size="small" color="inherit" sx={{ padding: 0, minWidth: 0 }}>
					<CalendarPrev className="cal-header-prev" />
				</MuiButton>
				<CalendarNav />
				<MuiButton size="small" color="inherit" sx={{ padding: 0, minWidth: 0 }}>
					<CalendarNext className="cal-header-next" />
				</MuiButton>
			</Stack>
		</>
	)

	return (
		<Page title="WP">
			<Container maxWidth="xl">
				{/* <Message /> */}
				<Box sx={{ position: 'absolute', top: 28, right: 44 }}>
					<MuiButton variant="contained" size="medium" color="inherit" sx={{ border: '1px solid #596570' }}>
						승인 요청
					</MuiButton>
					<MuiButton
						onClick={() => setisDrawerOpen(true)}
						variant="contained"
						size="medium"
						color="inherit"
						sx={{ background: '#8D99FF', marginLeft: 1, minWidth: 40, width: 40, padding: '5px 0', height: 37 }}
					>
						<Iconify icon="uil:bars" width={25} height={25} color="white" />
					</MuiButton>
				</Box>
				<Grid container spacing={3}>
					<Grid item sm={12} md={3}>
						<LeftMenu />
					</Grid>
					<Grid item sm={12} md={9}>
						<Box className="weekly-calender" position={'relative'}>
							<Loader open={loader} setOpen={setLoader} />
							<Drawer />
							<Eventcalendar
								renderResourceHeader={renderCustomHeader}
								renderHeader={renderHeader}
								view={viewSettings}
								data={myEvents}
								invalid={invalid}
								displayTimezone="local"
								dataTimezone="local"
								onPageLoading={onPageLoading}
								renderResource={renderCustomResource}
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
								cssClass="md-resource-header-template"
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
						</Box>
					</Grid>
				</Grid>
				<Grid container spacing={3} mt={1}>
					<Grid item sm={12} md={3}>
						<ProgressRate />
					</Grid>
					<Grid item sm={12} md={9}>
						<img src={'/static/images/Weekly-HardCode.png'} alt={'weekly'} />
					</Grid>
				</Grid>
			</Container>

			{isDrawerOpen && <BasicTabs open={isDrawerOpen} setopen={setisDrawerOpen} />}
		</Page>
	)
}

export default App
